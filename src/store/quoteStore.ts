// src/store/quoteStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  SavedQuote, 
  QuoteStatus, 
  QuoteHistory, 
  QuotePrimaryStatus 
} from '@/types/quote.types';

interface QuoteStore {
  quotes: SavedQuote[];
  lastReference: number;
  addQuote: (quote: Omit<SavedQuote, 'id' | 'reference'>) => void;
  updateQuote: (id: string, updates: Partial<SavedQuote>) => void;
  deleteQuote: (id: string) => void;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: [],
      lastReference: 0,

      addQuote: (quote) => {
        const newReference = get().lastReference + 1;
        const paddedReference = newReference.toString().padStart(4, '0');
        
        const newQuote: SavedQuote = {
          ...quote,
          quote_id: crypto.randomUUID(),
          quote_reference: `QB-${paddedReference}`,
          status: 'draft' as QuotePrimaryStatus,
          currentStatus: 'draft',
          quote_items: [],
          quote_history: [],
          date_created: new Date().toISOString(),
          date_modified: new Date().toISOString(),
          created_by: 'system',
          subtotal: 0,
          vat: 0,
          total: 0,
          customer_id: quote.customer_id,
          customers: quote.customers,
        };

        set((state) => ({
          quotes: [newQuote, ...state.quotes],
          lastReference: newReference,
        }));
      },

      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((quote) =>
            quote.quote_id === id ? { ...quote, ...updates } : quote
          ),
        }));
      },

      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((quote) => quote.quote_id !== id),
        }));
      },

      updateQuoteStatus: (id, newStatus) => {
        set((state) => ({
          quotes: state.quotes.map((quote) => {
            if (quote.quote_id !== id) return quote;

            const newHistory: QuoteHistory = {
              history_id: crypto.randomUUID(),
              quote_id: quote.quote_id,
              status_from: quote.currentStatus || null,
              status_to: newStatus,
              changed_by: 'system',
              date_changed: new Date().toISOString(),
              notes: `Status changed from ${quote.currentStatus || 'none'} to ${newStatus}`,
            };

            // Determine if this is a primary or secondary status
            const isPrimaryStatus = ['draft', 'approved', 'rejected'].includes(newStatus);
            
            return {
              ...quote,
              status: isPrimaryStatus ? newStatus as QuotePrimaryStatus : quote.status,
              currentStatus: newStatus,
              secondary_statuses: isPrimaryStatus 
                ? quote.secondary_statuses 
                : [...(quote.secondary_statuses || []), newStatus],
              date_modified: new Date().toISOString(),
              quote_history: [newHistory, ...quote.quote_history],
            } as SavedQuote;
          }),
        }));
      },
    }),
    {
      name: 'quotes-storage',
    }
  )
);