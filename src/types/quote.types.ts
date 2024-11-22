import type { SupabaseCustomer } from './customer.types';

// Quote-related types
export type QuotePrimaryStatus = 'draft' | 'approved' | 'rejected';
export type QuoteSecondaryStatus = 'emailed' | 'printed' | 'woo';
export type QuoteStatus = QuotePrimaryStatus | QuoteSecondaryStatus;

export interface LayoutCalculations {
  id: number;
  quote_id: number;
  item_id: number;
  optimal_layout: string;  // Store full text: "21 repeats per SRA3"
  layout_details: string;  // Store full text: "3 across × 7 down - Portrait"
  sheets_required: string; // Store full text: "12 sheets for 250 units"
}

export interface QuoteItem {
  item_id: number;  // Changed to number
  quote_id: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
  layout_calculations?: LayoutCalculations;  
}

export interface QuoteHistory {
 history_id: string;
 quote_id: string;
 status_from: QuoteStatus | null;
 status_to: QuoteStatus;
 changed_by: string;
 date_changed: string;
 notes: string;
}

export interface SavedQuote {
 quote_id: string;
 quote_reference: string;
 customer_id: string;
 date_created: string;
 date_modified: string;
 subtotal: number;
 vat: number;
 total: number;
 status: QuotePrimaryStatus;
 currentStatus?: QuoteStatus;
 created_by: string;
 date_emailed?: string;
 date_printed?: string;
 date_to_woo?: string;
 notes?: string;
 discount_percentage?: number;
 discount_value?: number;
 subtotal_after_discount?: number;
 quote_items: QuoteItem[];
 quote_history: QuoteHistory[];
 customers: SupabaseCustomer;
 secondary_statuses?: QuoteSecondaryStatus[];
}