import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

interface CartSummaryProps {
 subtotal: number;
 vat: number;
 total: number;
 onTotalsChange?: (values: { 
   subtotal: number; 
   vat: number; 
   total: number;
   discount_percentage?: number;
   discount_value?: number;
   subtotal_after_discount?: number;
 }) => void;
}

export function CartSummary({ subtotal: initialSubtotal, onTotalsChange }: CartSummaryProps) {
 const [discountPercent, setDiscountPercent] = useState<string>('');
 const [discountValue, setDiscountValue] = useState<string>('');

 // Calculate discount on the pre-VAT amount
 const calculatedDiscount = discountPercent 
   ? Number((initialSubtotal * (parseFloat(discountPercent) / 100)).toFixed(2))
   : discountValue 
   ? Number(parseFloat(discountValue).toFixed(2))
   : 0;

 const finalDiscount = Number(Math.min(calculatedDiscount, initialSubtotal).toFixed(2));
 const discountedSubtotal = Number((initialSubtotal - finalDiscount).toFixed(2));
 const calculatedVat = Number((discountedSubtotal * 0.15).toFixed(2));
 const finalTotal = Number((discountedSubtotal + calculatedVat).toFixed(2));

 // Calculate the effective discount percentage when a value is entered
 const effectiveDiscountPercentage = discountValue 
   ? Number(((finalDiscount / initialSubtotal) * 100).toFixed(2))
   : discountPercent 
   ? parseFloat(discountPercent)
   : undefined;

 const handlePercentChange = (value: string) => {
   if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
     setDiscountPercent(value);
     setDiscountValue('');
   }
 };

 const handleValueChange = (value: string) => {
   if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= initialSubtotal)) {
     setDiscountValue(value);
     setDiscountPercent('');
   }
 };

 // Notify parent of changes
 useEffect(() => {
   const timeoutId = setTimeout(() => {
     if (onTotalsChange) {
       const totals = {
         subtotal: initialSubtotal,
         vat: calculatedVat,
         total: finalTotal,
         discount_percentage: effectiveDiscountPercentage,
         discount_value: finalDiscount > 0 ? finalDiscount : undefined,
         subtotal_after_discount: finalDiscount > 0 ? discountedSubtotal : undefined
       };
       
       console.log('Calculated totals:', {
         original_subtotal: initialSubtotal,
         discount: finalDiscount,
         discounted_subtotal: discountedSubtotal,
         vat: calculatedVat,
         final_total: finalTotal,
         effective_discount_percentage: effectiveDiscountPercentage
       });
       
       onTotalsChange(totals);
     }
   }, 0);

   return () => clearTimeout(timeoutId);
 }, [
   initialSubtotal,
   calculatedVat,
   finalTotal,
   discountPercent,
   finalDiscount,
   discountedSubtotal,
   effectiveDiscountPercentage,
   onTotalsChange
 ]);

 return (
   <Card>
     <CardContent className="p-4">
       <div className="space-y-2">
         <div className="flex justify-between items-center text-sm">
           <span className="text-muted-foreground">Original Subtotal (excl VAT):</span>
           <span>R{initialSubtotal.toFixed(2)}</span>
         </div>
         
         <div className="flex justify-between items-center gap-2">
           <div className="flex items-center gap-2">
             <span className="text-sm text-muted-foreground">Discount %:</span>
             <Input
               type="number"
               min="0"
               max="100"
               value={discountPercent}
               onChange={(e) => handlePercentChange(e.target.value)}
               className="w-20 h-8"
             />
           </div>
           <div className="flex items-center gap-2">
             <span className="text-sm text-muted-foreground">Value:</span>
             <Input
               type="number"
               min="0"
               max={initialSubtotal}
               value={discountValue}
               onChange={(e) => handleValueChange(e.target.value)}
               className="w-24 h-8"
             />
           </div>
         </div>

         {finalDiscount > 0 && (
           <div className="flex justify-between items-center text-sm">
             <span className="text-muted-foreground">Discount Applied:</span>
             <span className="text-red-500">-R{finalDiscount.toFixed(2)}</span>
           </div>
         )}

         <div className="flex justify-between items-center text-sm">
           <span className="text-muted-foreground">Subtotal (after discount):</span>
           <span>R{discountedSubtotal.toFixed(2)}</span>
         </div>

         <div className="flex justify-between items-center text-sm">
           <span className="text-muted-foreground">VAT (15%):</span>
           <span>R{calculatedVat.toFixed(2)}</span>
         </div>

         <div className="flex justify-between items-center pt-2 border-t">
           <span className="text-lg font-semibold">Total:</span>
           <span className="text-2xl font-bold">R{finalTotal.toFixed(2)}</span>
         </div>
       </div>
     </CardContent>
   </Card>
 );
}
