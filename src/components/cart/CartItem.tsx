import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { roundToNearestFive } from '@/components/quote-builder/utils/calculations';

export interface CartItemData {
 id: string;
 description: string;
 price: number;
 quantity: number;
 total: number;
}

interface CartItemProps {
 item: CartItemData;
 isLast: boolean;
 onUpdate: (id: string, updates: Partial<CartItemData>) => void;
 onAdd: () => void;
 onRemove: (id: string) => void;
}

export function CartItem({ item, isLast, onUpdate, onAdd, onRemove }: CartItemProps) {
 const handlePriceChange = (value: string, isSpinner: boolean = false) => {
   // Allow empty input for better UX
   if (!value) {
     onUpdate(item.id, { 
       price: 0, 
       total: 0 
     });
     return;
   }

   // For spinner, handle as before
   if (isSpinner) {
     const numValue = parseFloat(value);
     if (isNaN(numValue) || numValue < 0) return;
     const newPrice = roundToNearestFive(numValue);
     const total = newPrice * item.quantity;
     onUpdate(item.id, { 
       price: newPrice,
       total 
     });
     return;
   }

   // For manual input, update as string first
   const numValue = parseFloat(value);
   if (isNaN(numValue) || numValue < 0) return;
   
   onUpdate(item.id, { 
     price: numValue,
     total: numValue * item.quantity
   });
 };

 const handleQuantityChange = (value: string) => {
   // Allow empty input for better UX
   if (!value) {
     onUpdate(item.id, { 
       quantity: 0, 
       total: 0 
     });
     return;
   }

   // Convert to integer and validate
   const quantity = parseInt(value);
   if (isNaN(quantity) || quantity < 0) return;

   // Calculate total using current price
   const total = item.price * quantity;
   
   onUpdate(item.id, { 
     quantity, 
     total 
   });
 };

 return (
   <div className="grid grid-cols-12 gap-3 items-start">
     <div className="col-span-5">
       <Textarea
         placeholder="Item description"
         value={item.description}
         onChange={(e) => onUpdate(item.id, { description: e.target.value })}
         className="resize-none"
       />
     </div>
     <div className="col-span-2">
       <Input
         type="text"
         inputMode="decimal"
         placeholder="Price"
         value={
           item.price === 0 
             ? '' 
             : String(item.price).includes('.') 
               ? item.price 
               : `${item.price}`
         }
         onChange={(e) => {
           const value = e.target.value;
           // Allow only numbers and decimal point
           if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
             handlePriceChange(value);
           }
         }}
         onBlur={(e) => {
           // On blur, format to 2 decimal places if needed
           if (!e.target.value) {
             handlePriceChange('0');
           } else {
             const value = parseFloat(e.target.value);
             if (!isNaN(value)) {
               onUpdate(item.id, {
                 price: value,
                 total: value * item.quantity
               });
             }
           }
         }}
         onKeyDown={(e) => {
           if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
             const currentValue = parseFloat(e.currentTarget.value || '0');
             const step = e.key === 'ArrowUp' ? 0.01 : -0.01;
             handlePriceChange((currentValue + step).toString(), true);
             e.preventDefault();
           }
         }}
       />
     </div>
     <div className="col-span-2">
       <Input
         type="number"
         min="0"
         placeholder="Quantity"
         value={item.quantity === 0 ? '' : item.quantity}
         onChange={(e) => handleQuantityChange(e.target.value)}
         onBlur={(e) => {
           // On blur, ensure we display 0 if empty
           if (!e.target.value) {
             handleQuantityChange('0');
           }
         }}
       />
     </div>
     <div className="col-span-2">
       <Input
         type="text"
         readOnly
         value={
           item.total === 0 
             ? '0.00' 
             : String(item.total).includes('.') 
               ? item.total.toFixed(2) 
               : `${item.total}.00`
         }
         className="bg-muted"
       />
     </div>
     <div className="col-span-1 flex gap-2">
       {isLast && (
         <Button variant="outline" size="icon" onClick={onAdd}>
           <Plus className="h-4 w-4" />
         </Button>
       )}
       <Button variant="outline" size="icon" onClick={() => onRemove(item.id)}>
         <Minus className="h-4 w-4" />
       </Button>
     </div>
   </div>
 );
}