import { useState, useCallback } from 'react';  // Add useCallback to imports
import { useNavigate } from 'react-router-dom';
import { CartSearch } from './CartSearch';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { CartActions } from './CartActions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { useCartStore } from '../../store/cartStore';
import { useCustomerStore } from '../../store/customerStore';
import { useSavedQuotesStore } from '../../store/savedQuotesStore';
import { useQuoteBuilderStore } from '../../store/quoteBuilderStore';
import type { WooCustomer } from '../../types/customer.types';
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from '../ui/alert-dialog';
import { Loader2, X } from 'lucide-react';

interface QuoteTotals {
 subtotal: number;
 vat: number;
 total: number;
 discount_percentage?: number;
 discount_value?: number;
 subtotal_after_discount?: number;
}

export function Cart() {
 const navigate = useNavigate();
 const { items, updateItem, removeItem, clearItems } = useCartStore();
 const { selectedCustomer, selectCustomer, clearSelection } = useCustomerStore();
 const { saveQuote, saving, error: saveError } = useSavedQuotesStore();
 const { layoutResult, sheetsRequired } = useQuoteBuilderStore();
 const [showSaveDialog, setShowSaveDialog] = useState(false);
 const [savedReference, setSavedReference] = useState<string | null>(null);
 const { toast } = useToast();

 // Calculate initial subtotal excluding VAT from the item totals
 const subtotal = Number(items.reduce((sum, item) => {
   const itemExVat = item.total / 1.15;  // Remove VAT from each item's total
   return sum + itemExVat;
 }, 0).toFixed(2));

 // Initialize quote totals with the ex-VAT subtotal
 const [quoteTotals, setQuoteTotals] = useState<QuoteTotals>({
   subtotal,  // This is now ex-VAT
   vat: Number((subtotal * 0.15).toFixed(2)),  // 15% of ex-VAT amount
   total: Number((subtotal * 1.15).toFixed(2))  // Subtotal + VAT
 });

 const handleSelectCustomer = (customer: WooCustomer) => {
   selectCustomer(customer);
   toast({
     title: 'Customer Selected',
     description: `${customer.first_name} ${customer.last_name} selected`,
   });
 };

 const handleRemoveCustomer = () => {
   clearSelection();
   toast({
     title: 'Customer Removed',
     description: 'Customer has been removed from the cart',
   });
 };

 const handleAddCustomer = () => {
   toast({
     title: 'Add Customer',
     description: 'Customer creation functionality to be implemented',
   });
 };

 const handleClearCart = () => {
   clearItems();
   clearSelection();
   toast({
     title: 'Success',
     description: 'Cart cleared successfully',
   });
 };

 const handleRemoveItem = (id: string) => {
   removeItem(id);
   if (items.length === 1) {
     clearSelection();
   }
 };

 const handleSave = async () => {
   if (!selectedCustomer) {
     toast({
       title: 'Error',
       description: 'Please select a customer before saving',
       variant: 'destructive',
     });
     return;
   }

   if (items.length === 0) {
     toast({
       title: 'Error',
       description: 'Cart is empty',
       variant: 'destructive',
     });
     return;
   }

   setShowSaveDialog(true);
 };

 const handleConfirmSave = async () => {
   try {
     const discountInfo = {
       discount_percentage: quoteTotals.discount_percentage,
       discount_value: quoteTotals.discount_value,
       subtotal_after_discount: quoteTotals.subtotal_after_discount,
       subtotal: quoteTotals.subtotal,
       vat: quoteTotals.vat,
       total: quoteTotals.total
     };

     // Update items with layout info if available
     const itemsWithLayout = items.map(item => {
       if (layoutResult && typeof sheetsRequired === 'number') {
         return {
           ...item,
           layoutInfo: {
             repeats: layoutResult.repeats,
             across: layoutResult.across,
             down: layoutResult.down,
             isLandscape: layoutResult.isLandscape,
             sheetsRequired
           }
         };
       }
       return item;
     });

     const { reference } = await saveQuote(
       itemsWithLayout, 
       selectedCustomer!, 
       discountInfo
     );
     
     setSavedReference(reference);
     clearItems();
     clearSelection();
     setTimeout(() => {
       navigate('/quotes');
     }, 1500);
   } catch (error) {
     toast({
       title: 'Error',
       description: saveError || 'Failed to save quote',
       variant: 'destructive',
     });
     setShowSaveDialog(false);
   }
 };

 const handleViewQuote = () => {
   setShowSaveDialog(false);
   setSavedReference(null);
   navigate('/quotes');
 };

 const handleTotalsChange = useCallback((values: QuoteTotals) => {
  console.log('Totals changed:', values);
  setQuoteTotals(values);
}, []); // Add empty dependency array

 return (
   <>
     <Card>
       <CardHeader>
         <CardTitle>Cart</CardTitle>
       </CardHeader>
       <CardContent className="space-y-6">
         <CartSearch 
           onSearch={() => {}}
           onAddCustomer={handleAddCustomer}
           onSelectCustomer={handleSelectCustomer}
         />

         {selectedCustomer && (
           <div className="bg-muted p-4 rounded-lg relative">
             <Button
               variant="ghost"
               size="icon"
               className="absolute right-2 top-2"
               onClick={handleRemoveCustomer}
             >
               <X className="h-4 w-4" />
             </Button>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label className="text-sm text-muted-foreground">Customer</Label>
                 <p className="font-medium">
                   {selectedCustomer.first_name} {selectedCustomer.last_name}
                 </p>
                 <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
               </div>
               {selectedCustomer.billing.company && (
                 <div>
                   <Label className="text-sm text-muted-foreground">Company</Label>
                   <p className="font-medium">{selectedCustomer.billing.company}</p>
                 </div>
               )}
             </div>
           </div>
         )}

         <div className="space-y-4">
           <div className="grid grid-cols-12 gap-3">
             <div className="col-span-5">
               <Label>Description</Label>
             </div>
             <div className="col-span-2">
               <Label>Price</Label>
             </div>
             <div className="col-span-2">
               <Label>Quantity</Label>
             </div>
             <div className="col-span-2">
               <Label>Total</Label>
             </div>
             <div className="col-span-1" />
           </div>

           <div className="space-y-3">
             {items.map((item) => (
               <CartItem
                 key={item.id}
                 item={item}
                 isLast={false}
                 onUpdate={updateItem}
                 onAdd={() => {}}
                 onRemove={handleRemoveItem}
               />
             ))}
           </div>
         </div>

         <div className="space-y-4">
           <CartSummary 
             subtotal={quoteTotals.subtotal}
             vat={quoteTotals.vat}
             total={quoteTotals.total}
             onTotalsChange={handleTotalsChange}
           />
           <CartActions
             onSave={handleSave}
             onClear={handleClearCart}
           />
         </div>
       </CardContent>
     </Card>

     <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>
             {savedReference ? 'Quote Saved Successfully' : 'Save Quote'}
           </AlertDialogTitle>
           <AlertDialogDescription>
             {savedReference
               ? `Quote ${savedReference} has been created and saved. Redirecting to quotes...`
               : 'Are you sure you want to save this quote? This will clear the cart.'}
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           {savedReference ? (
             <AlertDialogAction onClick={handleViewQuote}>
               View Quote
             </AlertDialogAction>
           ) : (
             <>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction onClick={handleConfirmSave} disabled={saving}>
                 {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Save Quote
               </AlertDialogAction>
             </>
           )}
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
   </>
 );
}
