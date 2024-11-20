import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Eye,
  Mail,
  Printer,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2, // Add this import
} from 'lucide-react';
import type { SavedQuote, QuoteSecondaryStatus } from '@/types/quote.types';

interface QuoteActionButtonsProps {
  quote: SavedQuote;
  onView: () => void;
  onEmail: () => void;
  onPrint: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSendToWoo: () => void;
  onDelete: () => void; // Add this prop
  loading?: {
    email?: boolean;
    woo?: boolean;
    print?: boolean;
    approve?: boolean;
    reject?: boolean;
    delete?: boolean;
  };
  className?: string;
}

export function QuoteActionButtons({
  quote,
  onView,
  onEmail,
  onPrint,
  onApprove,
  onReject,
  onSendToWoo,
  onDelete, // Add this prop
  loading = {},
  className,
}: QuoteActionButtonsProps) {
  const hasSecondaryStatus = (status: QuoteSecondaryStatus) => 
    quote.secondary_statuses?.includes(status);

  const isRejected = quote.status === 'rejected';
  const isApproved = quote.status === 'approved';
  const isPrinted = hasSecondaryStatus('printed');
  const isEmailed = hasSecondaryStatus('emailed');
  const isInWoo = hasSecondaryStatus('woo');

  // Disable conditions
  const disableApprove = isRejected || loading.approve;
  const disableReject = isApproved || loading.reject;
  const disableWoo = !isApproved || loading.woo || isInWoo;
  const disableEmail = loading.email;
  const disablePrint = loading.print;
  const disableDelete = loading.delete;

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onView}
        title="View Quote"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onEmail}
        disabled={disableEmail}
        title={isEmailed ? "Resend Email" : "Send Email"}
        className={cn(
          isEmailed && "text-purple-500 hover:text-purple-600"
        )}
      >
        {loading.email ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onPrint}
        disabled={disablePrint}
        title={isPrinted ? "Print Again" : "Print Quote"}
        className={cn(
          isPrinted && "text-blue-500 hover:text-blue-600"
        )}
      >
        {loading.print ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Printer className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onApprove}
        disabled={disableApprove}
        title={isApproved ? "Already Approved" : "Approve Quote"}
        className={cn(
          isApproved && "text-green-500 hover:text-green-600",
          isRejected && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading.approve ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onReject}
        disabled={disableReject}
        title={isRejected ? "Already Rejected" : "Reject Quote"}
        className={cn(
          isRejected && "text-red-500 hover:text-red-600",
          isApproved && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading.reject ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onSendToWoo}
        disabled={disableWoo}
        title={
          !isApproved 
            ? "Quote must be approved first" 
            : isInWoo 
              ? "Already in WooCommerce" 
              : "Send to WooCommerce"
        }
        className={cn(
          isInWoo && "text-orange-500 hover:text-orange-600",
          !isApproved && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading.woo ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>

      {/* Add Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={disableDelete}
        title="Delete Quote"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        {loading.delete ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}