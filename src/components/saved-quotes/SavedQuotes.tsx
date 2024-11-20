import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSavedQuotesStore } from '@/store/savedQuotesStore';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { generateQuotePDF } from '@/services/pdfService';
import { createWooCommerceOrder } from '@/services/woocommerce';
import { sendQuoteEmail } from '@/lib/email';
import type { SavedQuote } from '@/types/quote.types';
import { QuoteDetails } from './QuoteDetails';
import { QuoteList } from './QuoteList';
import { QuoteListHeader } from './QuoteListHeader';
import { QuotePagination } from './QuotePagination';

export function SavedQuotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<SavedQuote | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, {
    email?: boolean;
    woo?: boolean;
    print?: boolean;
    approve?: boolean;
    reject?: boolean;
    delete?: boolean;
  }>>({});
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { 
    quotes, 
    loading, 
    error, 
    fetchQuotes, 
    updateQuoteStatus, 
    deleteQuote,
    invalidateCache 
  } = useSavedQuotesStore();
  
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const setQuoteLoading = (quoteId: string, action: keyof typeof loadingStates[string], isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [quoteId]: {
        ...prev[quoteId],
        [action]: isLoading
      }
    }));
  };

  const handlePrint = async (quote: SavedQuote) => {
    setQuoteLoading(quote.quote_id, 'print', true);
    try {
      // Validate quote data
      if (!quote || !quote.customers) {
        toast({
          title: 'Error',
          description: 'Invalid quote data. Customer information is missing.',
          variant: 'destructive',
        });
        return;
      }

      // Generate PDF
      await generateQuotePDF(quote);

      // Update status only if PDF generation was successful
      try {
        await updateQuoteStatus(
          quote.quote_id, 
          quote.currentStatus, 
          'printed'
        );
        
        toast({
          title: 'Success',
          description: `Quote ${quote.quote_reference} has been generated as PDF`,
        });
      } catch (statusError) {
        console.error('Error updating quote status:', statusError);
        toast({
          title: 'Partial Success',
          description: 'PDF generated but failed to update quote status',
          variant: 'default', // or 'destructive' depending on your preference
        });
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error 
          ? error.message 
          : 'Failed to generate PDF quote',
        variant: 'destructive',
      });
    } finally {
      setQuoteLoading(quote.quote_id, 'print', false);
    }
  };

  const handleSendToWoo = async (quote: SavedQuote) => {
    if (quote.status !== 'approved') {
      toast({
        title: 'Error',
        description: 'Quote must be approved before sending to WooCommerce',
        variant: 'destructive',
      });
      return;
    }

    setQuoteLoading(quote.quote_id, 'woo', true);
    try {
      await createWooCommerceOrder(quote);
      await updateQuoteStatus(quote.quote_id, quote.currentStatus, 'woo');
      
      toast({
        title: 'Success',
        description: `Quote ${quote.quote_reference} has been pushed to WooCommerce`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to create WooCommerce order',
        variant: 'destructive',
      });
    } finally {
      setQuoteLoading(quote.quote_id, 'woo', false);
    }
  };

  const handleEmail = async (quote: SavedQuote) => {
    setQuoteLoading(quote.quote_id, 'email', true);
    try {
      await sendQuoteEmail(quote);
      await updateQuoteStatus(quote.quote_id, quote.currentStatus, 'emailed');
      
      toast({
        title: 'Success',
        description: `Quote ${quote.quote_reference} has been emailed`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      });
    } finally {
      setQuoteLoading(quote.quote_id, 'email', false);
    }
  };

  const handleApprove = async (quote: SavedQuote) => {
    if (quote.status === 'rejected') {
      toast({
        title: 'Error',
        description: 'Cannot approve a rejected quote',
        variant: 'destructive',
      });
      return;
    }
    
    setQuoteLoading(quote.quote_id, 'approve', true);
    try {
      await updateQuoteStatus(quote.quote_id, quote.currentStatus, 'approved');
      
      toast({
        title: 'Success',
        description: `Quote ${quote.quote_reference} has been approved`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve quote',
        variant: 'destructive',
      });
    } finally {
      setQuoteLoading(quote.quote_id, 'approve', false);
    }
  };

  const handleReject = async (quote: SavedQuote) => {
    if (quote.status === 'approved') {
      toast({
        title: 'Error',
        description: 'Cannot reject an approved quote',
        variant: 'destructive',
      });
      return;
    }
    
    setQuoteLoading(quote.quote_id, 'reject', true);
    try {
      await updateQuoteStatus(quote.quote_id, quote.currentStatus, 'rejected');
      
      toast({
        title: 'Success',
        description: `Quote ${quote.quote_reference} has been rejected`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject quote',
        variant: 'destructive',
      });
    } finally {
      setQuoteLoading(quote.quote_id, 'reject', false);
    }
  };

  const handleDelete = async (quote: SavedQuote) => {
    setQuoteLoading(quote.quote_id, 'delete', true);
    try {
      await deleteQuote(quote.quote_id);
      setSelectedQuote(null);
      
      toast({
        title: 'Success',
        description: `Quote ${quote.quote_reference} has been deleted`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete quote',
        variant: 'destructive',
      });
    } finally {
      setQuoteLoading(quote.quote_id, 'delete', false);
    }
  };

  const handleRefresh = () => {
    invalidateCache();
    fetchQuotes();
    toast({
      title: 'Refreshing',
      description: 'Updating quotes from the server...',
    });
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (!debouncedSearch) return true;
    
    const searchLower = debouncedSearch.toLowerCase();
    const customerName = quote.customers 
      ? `${quote.customers.name} ${quote.customers.surname}`.toLowerCase()
      : '';
    
    return (
      quote.quote_reference.toLowerCase().includes(searchLower) ||
      customerName.includes(searchLower) ||
      quote.customers?.email.toLowerCase().includes(searchLower) ||
      quote.customers?.company_name?.toLowerCase().includes(searchLower) ||
      quote.customers?.phone?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredQuotes.length / pageSize);
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Saved Quotes</CardTitle>
            <QuoteListHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              pageSize={pageSize}
              onPageSizeChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
              onRefresh={handleRefresh}
            />
          </div>
        </CardHeader>
        <CardContent>
          <QuoteList
            quotes={paginatedQuotes}
            loading={loading}
            loadingStates={loadingStates}
            onView={setSelectedQuote}
            onEmail={handleEmail}
            onPrint={handlePrint}
            onApprove={handleApprove}
            onReject={handleReject}
            onSendToWoo={handleSendToWoo}
            onDelete={handleDelete}
          />

          <QuotePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredQuotes.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {selectedQuote && (
        <QuoteDetails
          quote={selectedQuote}
          open={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </>
  );
}