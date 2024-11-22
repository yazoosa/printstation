import { format } from 'date-fns';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
} from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import type { SavedQuote } from '../../types/quote.types';

interface QuoteDetailsProps {
 quote: SavedQuote;
 open: boolean;
 onClose: () => void;
}

export function QuoteDetails({ quote, open, onClose }: QuoteDetailsProps) {
 const formatDate = (date: string | undefined) => {
   if (!date) return 'Not set';
   return format(new Date(date), 'dd/MM/yyyy HH:mm');
 };

 const formatCustomerName = () => {
   if (!quote.customers) {
     return 'Unknown Customer';
   }
   return `${quote.customers.name} ${quote.customers.surname}`.trim() || 'Unknown Customer';
 };

 const formatAddress = () => {
   if (!quote.customers) {
     return 'No address available';
   }

   const parts = [
     quote.customers.street_address,
     quote.customers.complex_or_building,
     quote.customers.city,
     quote.customers.area,
     quote.customers.postal_code,
   ].filter(Boolean);

   return parts.join(', ') || 'No address available';
 };

 return (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Quote Details - {quote.quote_reference}</DialogTitle>
        <DialogDescription>
          Details for quote {quote.quote_reference} created on {formatDate(quote.date_created)}
        </DialogDescription>
      </DialogHeader>

       <div className="space-y-6">
         <Card>
           <CardContent className="pt-6">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label className="text-sm text-muted-foreground">Reference</Label>
                 <p className="font-medium">{quote.quote_reference}</p>
               </div>
               <div>
                 <Label className="text-sm text-muted-foreground">Status</Label>
                 <div className="flex gap-2 mt-1">
                   <QuoteStatusBadge 
                     status={quote.status} 
                     secondaryStatuses={quote.secondary_statuses}
                   />
                 </div>
               </div>
               <div>
                 <Label className="text-sm text-muted-foreground">Created</Label>
                 <p className="font-medium">{formatDate(quote.date_created)}</p>
               </div>
               <div>
                 <Label className="text-sm text-muted-foreground">Last Modified</Label>
                 <p className="font-medium">{formatDate(quote.date_modified)}</p>
               </div>
               {quote.date_emailed && (
                 <div>
                   <Label className="text-sm text-muted-foreground">Emailed</Label>
                   <p className="font-medium">{formatDate(quote.date_emailed)}</p>
                 </div>
               )}
               {quote.date_printed && (
                 <div>
                   <Label className="text-sm text-muted-foreground">Printed</Label>
                   <p className="font-medium">{formatDate(quote.date_printed)}</p>
                 </div>
               )}
               {quote.date_to_woo && (
                 <div>
                   <Label className="text-sm text-muted-foreground">Sent to WooCommerce</Label>
                   <p className="font-medium">{formatDate(quote.date_to_woo)}</p>
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardContent className="pt-6">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label className="text-sm text-muted-foreground">Name</Label>
                 <p className="font-medium">{formatCustomerName()}</p>
               </div>
               {quote.customers?.company_name && (
                 <div>
                   <Label className="text-sm text-muted-foreground">Company</Label>
                   <p className="font-medium">{quote.customers.company_name}</p>
                 </div>
               )}
               <div>
                 <Label className="text-sm text-muted-foreground">Email</Label>
                 <p className="font-medium">{quote.customers?.email || 'No email'}</p>
               </div>
               <div>
                 <Label className="text-sm text-muted-foreground">Phone</Label>
                 <p className="font-medium">{quote.customers?.phone || 'No phone'}</p>
               </div>
               <div className="col-span-2">
                 <Label className="text-sm text-muted-foreground">Address</Label>
                 <p className="font-medium">{formatAddress()}</p>
               </div>
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardContent className="pt-6">
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
                 <div className="col-span-3">
                   <Label>Total</Label>
                 </div>
               </div>

               <div className="space-y-3">
                 {quote.quote_items.map((item) => (
                   <div key={item.item_id} className="space-y-3">
                     <div className="grid grid-cols-12 gap-3">
                       <div className="col-span-5">
                         <p className="text-sm whitespace-pre-line">{item.description}</p>
                       </div>
                       <div className="col-span-2">
                         <p className="text-sm">R{item.price.toFixed(2)}</p>
                       </div>
                       <div className="col-span-2">
                         <p className="text-sm">{item.quantity}</p>
                       </div>
                       <div className="col-span-3">
                         <p className="text-sm">R{item.total.toFixed(2)}</p>
                       </div>
                     </div>

                     {item.layout_calculations && (
                       <div className="ml-4 mt-2 p-3 bg-muted rounded-md">
                         <div className="grid grid-cols-3 gap-4 text-sm">
                           <div>
                             <span>{item.layout_calculations.optimal_layout}</span>
                           </div>
                           <div>
                             <span>{item.layout_calculations.layout_details}</span>
                           </div>
                           <div>
                             <span>{item.layout_calculations.sheets_required}</span>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>

               <div className="pt-4 border-t space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Subtotal:</span>
                   <span>R{quote.subtotal.toFixed(2)}</span>
                 </div>

                 {(quote.discount_percentage || quote.discount_value) && (
                   <>
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">
                         Discount {quote.discount_percentage && `(${quote.discount_percentage}%)`}:
                       </span>
                       <span className="text-red-500">-R{quote.discount_value?.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Subtotal (after discount):</span>
                       <span>R{quote.subtotal_after_discount?.toFixed(2)}</span>
                     </div>
                   </>
                 )}

                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">VAT (15%):</span>
                   <span>R{quote.vat.toFixed(2)}</span>
                 </div>

                 <div className="flex justify-between pt-2 border-t">
                   <span className="font-medium">Total:</span>
                   <span className="font-bold">R{quote.total.toFixed(2)}</span>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>

         {quote.quote_history.length > 0 && (
           <Card>
             <CardContent className="pt-6">
               <div className="space-y-4">
                 {quote.quote_history.map((history) => (
                   <div key={history.history_id} className="flex items-start gap-4">
                     <Badge variant="outline" className="mt-0.5">
                       {format(new Date(history.date_changed), 'dd/MM/yyyy HH:mm')}
                     </Badge>
                     <div>
                       <p className="font-medium">
                         Status changed from{' '}
                         {history.status_from ? (
                           <span className="font-normal">{history.status_from}</span>
                         ) : (
                           <span className="italic font-normal">none</span>
                         )}{' '}
                         to <span className="font-normal">{history.status_to}</span>
                       </p>
                       {history.notes && (
                         <p className="text-sm text-muted-foreground mt-1">
                           {history.notes}
                         </p>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         )}
       </div>
     </DialogContent>
   </Dialog>
 );
}
