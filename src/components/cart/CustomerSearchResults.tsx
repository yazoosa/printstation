import { WooCustomer } from '@/types/customer.types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Loader2 } from 'lucide-react';

interface CustomerSearchResultsProps {
  customers: WooCustomer[];
  loading: boolean;
  error: string | null;
  onSelect: (customer: WooCustomer) => void;
}

export function CustomerSearchResults({
  customers,
  loading,
  error,
  onSelect,
}: CustomerSearchResultsProps) {
  if (loading) {
    return (
      <Command className="rounded-lg border shadow-md">
        <CommandList>
          <CommandGroup>
            <div className="p-4 text-center">
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  if (error) {
    return (
      <Command className="rounded-lg border shadow-md">
        <CommandList>
          <CommandGroup>
            <div className="p-4 text-center text-destructive">{error}</div>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandList>
        <CommandGroup>
          {customers.length === 0 ? (
            <CommandEmpty>No customers found</CommandEmpty>
          ) : (
            customers.map((customer) => (
              <CommandItem
                key={customer.id}
                onSelect={() => onSelect(customer)}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {customer.email}
                  </span>
                  {customer.billing.company && (
                    <span className="text-sm text-muted-foreground">
                      {customer.billing.company}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}