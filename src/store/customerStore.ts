import { create } from 'zustand';
import type { WooCustomer } from '@/types/customer.types';

const API_BASE_URL = import.meta.env.VITE_WC_API_URL + '/customers';
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;

if (!API_BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
  throw new Error('Missing WooCommerce environment variables');
}

interface CustomerStore {
  customers: WooCustomer[];
  selectedCustomer: WooCustomer | null;
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  searchCustomers: (query: string, page?: number) => Promise<void>;
  selectCustomer: (customer: WooCustomer) => void;
  clearSelection: () => void;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  searchQuery: '',

  searchCustomers: async (query: string, page = 1) => {
    // Don't search if query is empty
    if (!query.trim()) {
      set({ 
        customers: [],
        loading: false,
        error: null,
        searchQuery: '',
        total: 0,
        totalPages: 0,
        currentPage: 1
      });
      return;
    }

    set({ loading: true, error: null, searchQuery: query });

    try {
      const params = new URLSearchParams({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        search: query,
        per_page: '10',
        page: page.toString(),
        orderby: 'id',
        order: 'desc',
      });

      const response = await fetch(`${API_BASE_URL}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch customers');
      }

      const data: WooCustomer[] = await response.json();
      const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
      
      // Validate the response data
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      set({
        customers: data,
        total,
        totalPages,
        currentPage: page,
        loading: false,
        error: null
      });
    } catch (error) {
      // Only set error state if the component is still mounted and searching
      if (get().searchQuery === query) {
        set({ 
          error: (error as Error).message || 'Failed to fetch customers', 
          loading: false,
          customers: []
        });
      }
    }
  },

  selectCustomer: (customer: WooCustomer) => {
    set({ selectedCustomer: customer });
  },

  clearSelection: () => {
    set({ selectedCustomer: null });
  }
}));