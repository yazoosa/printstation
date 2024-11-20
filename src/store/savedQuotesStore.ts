import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { SavedQuote, QuoteStatus, QuoteHistory } from '../types/quote.types';
import type { CartItemData } from '../components/cart/CartItem';
import type { WooCustomer } from '../types/customer.types';

interface QuoteDiscountInfo {
 subtotal: number;
 vat: number; 
 total: number;
 discount_percentage?: number;
 discount_value?: number;
 subtotal_after_discount?: number;
}

interface LayoutCalculationsInfo {
 repeats: number;
 layout: number;
 sheets: number;
}

interface QuoteData {
 quote_reference: string;
 customer_id: string;
 date_created: string;
 date_modified: string;
 subtotal: number;
 vat: number;
 total: number;
 status: QuoteStatus;
 created_by: string;
 discount_percentage: number | null;
 discount_value: number | null;
 subtotal_after_discount: number | null;
}

interface CustomerData {
 name: string;
 surname: string;
 company_name: string;
 email: string;
 phone: string;
 street_address: string;
 complex_or_building: string;
 city: string;
 area: string;
 postal_code: string;
 active: boolean;
}

interface SavedQuotesState {
 quotes: SavedQuote[];
 loading: boolean;
 saving: boolean;
 error: string | null;
 lastFetch: number | null;
 fetchQuotes: () => Promise<void>;
 saveQuote: (
   items: CartItemData[], 
   customer: WooCustomer, 
   discountInfo: QuoteDiscountInfo,
   layoutCalculations?: LayoutCalculationsInfo
 ) => Promise<{ reference: string }>;
 updateQuoteStatus: (id: string, fromStatus: QuoteStatus | undefined, toStatus: QuoteStatus) => Promise<void>;
 deleteQuote: (id: string) => Promise<void>;
 invalidateCache: () => void;
}

export const useSavedQuotesStore = create<SavedQuotesState>()(
 persist(
   (set, get) => ({
     quotes: [],
     loading: false,
     saving: false,
     error: null,
     lastFetch: null,

     fetchQuotes: async () => {
       const currentTime = Date.now();
       const lastFetch = get().lastFetch;
       const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

       if (lastFetch && currentTime - lastFetch < CACHE_DURATION) {
         return;
       }

       set({ loading: true, error: null });

       try {
         const { data: quotes, error } = await supabase
           .from('saved_quotes')
           .select(`
             *,
             customers (*),
             quote_items (*),
             quote_history (*),
             layout_calculations (*)
           `)
           .order('date_created', { ascending: false });

         if (error) throw error;

         const quotesWithData = quotes.map(quote => ({
           ...quote,
           quote_items: quote.quote_items || [],
           quote_history: quote.quote_history || [],
           currentStatus: quote.quote_history?.[0]?.status_to || 'draft',
           secondary_statuses: quote.quote_history
             ?.filter((h: QuoteHistory) => h.status_to !== quote.status)
             .map((h: QuoteHistory) => h.status_to) || []
         }));

         set({ 
           quotes: quotesWithData, 
           error: null,
           lastFetch: currentTime
         });
       } catch (error) {
         console.error('Error fetching quotes:', error);
         set({ error: (error as Error).message });
       } finally {
         set({ loading: false });
       }
     },

     saveQuote: async (items, wooCustomer, discountInfo, layoutCalculations) => {
       set({ saving: true, error: null });

       try {
         const { data: mappings, error: mappingError } = await supabase
           .from('customer_woo_mapping')
           .select('supabase_id')
           .eq('woo_id', wooCustomer.id);

         if (mappingError) {
           console.error('Error fetching customer mapping:', mappingError);
           throw mappingError;
         }

         let supabaseCustomerId: string;
         const mapping = mappings?.[0];

         const customerData: CustomerData = {
           name: wooCustomer.first_name || '',
           surname: wooCustomer.last_name || '',
           company_name: wooCustomer.billing.company || '',
           email: wooCustomer.email || '',
           phone: wooCustomer.billing.phone || '',
           street_address: wooCustomer.billing.address_1 || '',
           complex_or_building: wooCustomer.billing.address_2 || '',
           city: wooCustomer.billing.city || '',
           area: wooCustomer.billing.state || '',
           postal_code: wooCustomer.billing.postcode || '',
           active: true
         };

         if (!mapping) {
           const { data: newCustomer, error: createError } = await supabase
             .from('customers')
             .insert([customerData])
             .select()
             .single();

           if (createError) {
             console.error('Error creating customer:', createError);
             throw createError;
           }

           if (!newCustomer) throw new Error('Failed to create customer');
           
           const { error: mappingCreateError } = await supabase
             .from('customer_woo_mapping')
             .insert([{
               supabase_id: newCustomer.id,
               woo_id: wooCustomer.id
             }]);

           if (mappingCreateError) throw mappingCreateError;
           
           supabaseCustomerId = newCustomer.id;
         } else {
           supabaseCustomerId = mapping.supabase_id;
           
           const { error: updateError } = await supabase
             .from('customers')
             .update(customerData)
             .eq('id', supabaseCustomerId);

           if (updateError) {
             console.error('Error updating customer:', updateError);
             throw updateError;
           }
         }

         const { data: lastQuote } = await supabase
           .from('saved_quotes')
           .select('quote_reference')
           .order('quote_reference', { ascending: false })
           .limit(1)
           .single();

         const lastNumber = lastQuote
           ? parseInt(lastQuote.quote_reference.split('-')[1])
           : 0;
         const newReference = `QB-${(lastNumber + 1).toString().padStart(4, '0')}`;

         const quoteData: QuoteData = {
           quote_reference: newReference,
           customer_id: supabaseCustomerId,
           date_created: new Date().toISOString(),
           date_modified: new Date().toISOString(),
           subtotal: discountInfo.subtotal,
           vat: discountInfo.vat,
           total: discountInfo.total,
           status: 'draft',
           created_by: 'system',
           discount_percentage: discountInfo.discount_percentage || null,
           discount_value: discountInfo.discount_value || null,
           subtotal_after_discount: discountInfo.subtotal_after_discount || null
         };

         console.log('Saving quote with data:', quoteData);

         const { data: quotes, error: quoteError } = await supabase
           .from('saved_quotes')
           .insert([quoteData])
           .select();

         if (quoteError) {
           console.error('Error saving quote:', quoteError);
           throw quoteError;
         }

         const quote = quotes?.[0];
         if (!quote) throw new Error('Failed to create quote');

         const { error: itemsError } = await supabase
           .from('quote_items')
           .insert(
             items.map(item => ({
               quote_id: quote.quote_id,
               description: item.description,
               price: item.price,
               quantity: item.quantity,
               total: item.total,
             }))
           );

         if (itemsError) throw itemsError;

         if (layoutCalculations) {
           const { error: layoutError } = await supabase
             .from('layout_calculations')
             .insert([{
               quote_id: quote.quote_id,
               repeats: layoutCalculations.repeats,
               layout: layoutCalculations.layout,
               sheets: layoutCalculations.sheets
             }]);

           if (layoutError) {
             console.error('Error saving layout calculations:', layoutError);
           }
         }

         const { error: historyError } = await supabase
           .from('quote_history')
           .insert([{
             quote_id: quote.quote_id,
             status_from: null,
             status_to: 'draft',
             changed_by: 'system',
             date_changed: new Date().toISOString(),
             notes: 'Quote created',
           }]);

         if (historyError) throw historyError;

         await get().fetchQuotes();

         return { reference: newReference };
       } catch (error) {
         console.error('Error saving quote:', error);
         set({ error: (error as Error).message });
         throw error;
       } finally {
         set({ saving: false });
       }
     },

     updateQuoteStatus: async (id, fromStatus, toStatus) => {
       set({ loading: true, error: null });

       try {
         const now = new Date().toISOString();

         const { error: historyError } = await supabase
           .from('quote_history')
           .insert([{
             quote_id: id,
             status_from: fromStatus || null,
             status_to: toStatus,
             changed_by: 'system',
             date_changed: now,
             notes: `Status changed from ${fromStatus || 'none'} to ${toStatus}`,
           }]);

         if (historyError) throw historyError;

         const isPrimaryStatus = ['draft', 'approved', 'rejected'].includes(toStatus);
         if (isPrimaryStatus) {
           const { error: updateError } = await supabase
             .from('saved_quotes')
             .update({
               status: toStatus,
               date_modified: now,
             })
             .eq('quote_id', id);

           if (updateError) throw updateError;
         }

         const dateFields: Record<string, string> = {
           printed: 'date_printed',
           emailed: 'date_emailed',
           woo: 'date_to_woo',
         };

         if (dateFields[toStatus]) {
           const { error: dateError } = await supabase
             .from('saved_quotes')
             .update({
               [dateFields[toStatus]]: now,
               date_modified: now,
             })
             .eq('quote_id', id);

           if (dateError) throw dateError;
         }

         await get().fetchQuotes();
       } catch (error) {
         console.error('Error updating quote status:', error);
         set({ error: (error as Error).message });
         throw error;
       } finally {
         set({ loading: false });
       }
     },

     deleteQuote: async (id) => {
       set({ loading: true, error: null });

       try {
         const { error } = await supabase
           .from('saved_quotes')
           .delete()
           .eq('quote_id', id);

         if (error) throw error;

         set(state => ({
           quotes: state.quotes.filter(quote => quote.quote_id !== id),
         }));
       } catch (error) {
         console.error('Error deleting quote:', error);
         set({ error: (error as Error).message });
         throw error;
       } finally {
         set({ loading: false });
       }
     },

     invalidateCache: () => {
       set({ lastFetch: null });
     },
   }),
   {
     name: 'saved-quotes-storage',
     partialize: (state) => ({
       quotes: state.quotes,
       lastFetch: state.lastFetch,
     }),
   }
 )
);