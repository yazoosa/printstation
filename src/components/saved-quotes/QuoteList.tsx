import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { QuoteActionButtons } from './QuoteActionButtons';
import type { SavedQuote } from '../../types/quote.types';

interface QuoteListProps {
  quotes: SavedQuote[];
  loading: boolean;
  loadingStates: Record<string, {
    email?: boolean;
    woo?: boolean;
    print?: boolean;
    approve?: boolean;
    reject?: boolean;
    delete?: boolean;
  }>;
  onView: (quote: SavedQuote) => void;
  onEmail: (quote: SavedQuote) => void;
  onPrint: (quote: SavedQuote) => void;
  onApprove: (quote: SavedQuote) => void;
  onReject: (quote: SavedQuote) => void;
  onSendToWoo: (quote: SavedQuote) => void;
  onDelete: (quote: SavedQuote) => void;
}

export function QuoteList({
  quotes,
  loading,
  loadingStates,
  onView,
  onEmail,
  onPrint,
  onApprove,
  onReject,
  onSendToWoo,
  onDelete,
}: QuoteListProps) {
  const formatCustomerName = (quote: SavedQuote) => {
    if (!quote.customers) {
      return 'Unknown Customer';
    }
    return `${quote.customers.name} ${quote.customers.surname}`.trim() || 'Unknown Customer';
  };

  const getCustomerDetails = (quote: SavedQuote) => {
    if (!quote.customers) {
      return null;
    }

    return {
      name: formatCustomerName(quote),
      company: quote.customers.company_name,
      email: quote.customers.email,
    };
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => {
              const customerDetails = getCustomerDetails(quote);
              return (
                <TableRow key={quote.quote_id}>
                  <TableCell className="font-medium">
                    {quote.quote_reference}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{customerDetails?.name}</span>
                      {customerDetails?.company && (
                        <span className="text-sm text-muted-foreground">
                          {customerDetails.company}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(quote.date_created), 'dd/MM/yy')}
                  </TableCell>
                  <TableCell>
                    <QuoteStatusBadge 
                      status={quote.status} 
                      secondaryStatuses={quote.secondary_statuses}
                    />
                  </TableCell>
                  <TableCell className="text-right">
 <div className="flex flex-col items-end">
   {(quote.discount_percentage || quote.discount_value) && (
     <div className="text-sm">
       <span className="text-xs text-green-600">
         ({quote.discount_percentage}% off)
       </span>
     </div>
   )}
   <span className="font-medium">R{quote.total.toFixed(2)}</span>
 </div>
</TableCell>
                  <TableCell>
                    <QuoteActionButtons
                      quote={quote}
                      onView={() => onView(quote)}
                      onEmail={() => onEmail(quote)}
                      onPrint={() => onPrint(quote)}
                      onApprove={() => onApprove(quote)}
                      onReject={() => onReject(quote)}
                      onSendToWoo={() => onSendToWoo(quote)}
                      onDelete={() => onDelete(quote)}
                      loading={loadingStates[quote.quote_id]}
                      className="justify-end"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
