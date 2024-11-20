import { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CustomerSearchResults } from './CustomerSearchResults';
import { CustomerForm } from './CustomerForm';
import { useCustomerStore } from '@/store/customerStore';
import { useDebounce } from '@/hooks/use-debounce';
import type { WooCustomer } from '@/types/customer.types';

interface CartSearchProps {
  onSearch: (query: string) => void;
  onAddCustomer: () => void;
  onSelectCustomer: (customer: WooCustomer) => void;
}

export function CartSearch({ onSearch, onAddCustomer, onSelectCustomer }: CartSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { 
    customers, 
    loading, 
    error,
    searchCustomers,
    selectedCustomer
  } = useCustomerStore();

  useEffect(() => {
    if (debouncedQuery && showResults) {
      searchCustomers(debouncedQuery);
    }
  }, [debouncedQuery, showResults, searchCustomers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
    onSearch(value);
  };

  const handleSelectCustomer = (customer: WooCustomer) => {
    onSelectCustomer(customer);
    setShowResults(false);
    setQuery(`${customer.first_name} ${customer.last_name}`);
  };

  const handleShowForm = () => {
    setShowForm(true);
    onAddCustomer();
  };

  const handleCustomerCreated = (customer: WooCustomer) => {
    handleSelectCustomer(customer);
    setShowForm(false);
  };

  return (
    <div className="relative flex-1" ref={searchRef}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <div className="absolute right-0 top-0 h-full flex items-center">
        <Separator orientation="vertical" className="h-5 mx-2" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 mr-1"
          onClick={handleShowForm}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Input
        placeholder="Search customer..."
        className="pl-9 pr-16"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setQuery(query)}
      />
      {showResults && !selectedCustomer && (
        <div className="absolute w-full mt-1 z-50">
          <CustomerSearchResults
            customers={customers}
            loading={loading}
            error={error}
            onSelect={handleSelectCustomer}
          />
        </div>
      )}

      <CustomerForm 
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleCustomerCreated}
      />
    </div>
  );
}