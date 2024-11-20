import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuotePrimaryStatus, QuoteSecondaryStatus } from '@/types/quote.types';

interface QuoteStatusBadgeProps {
  status: QuotePrimaryStatus;
  secondaryStatuses?: QuoteSecondaryStatus[];
  className?: string;
}

const PRIMARY_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
} as const;

const SECONDARY_STATUS_CONFIG = {
  emailed: {
    label: 'Emailed',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  },
  printed: {
    label: 'Printed',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  woo: {
    label: 'WooCommerce',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  },
} as const;

export function QuoteStatusBadge({ 
  status, 
  secondaryStatuses = [], 
  className 
}: QuoteStatusBadgeProps) {
  const primaryConfig = PRIMARY_STATUS_CONFIG[status] || PRIMARY_STATUS_CONFIG.draft;

  // Remove duplicate statuses while preserving order
  const uniqueSecondaryStatuses = Array.from(new Set(secondaryStatuses));

  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge 
        key="primary"
        variant="outline" 
        className={cn(primaryConfig.className, className)}
      >
        {primaryConfig.label}
      </Badge>
      {uniqueSecondaryStatuses.map((secondaryStatus, index) => {
        const config = SECONDARY_STATUS_CONFIG[secondaryStatus];
        if (!config) return null;

        return (
          <Badge
            key={`${secondaryStatus}-${index}`}
            variant="outline"
            className={cn(config.className, className)}
          >
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
}