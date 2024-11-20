import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { SupabaseCustomer, WooCustomer } from '@/types/customer.types';

interface SupabaseCustomerStore {
  customers: SupabaseCustomer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (wooCustomer: WooCustomer) => Promise<SupabaseCustomer>;
  getCustomerById: (id: string) => Promise<SupabaseCustomer | null>;
  updateCustomer: (id: string, data: Partial<SupabaseCustomer>) => Promise<void>;
}

export const useSupabaseCustomerStore = create<SupabaseCustomerStore>((set, get) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ customers: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addCustomer: async (wooCustomer: WooCustomer) => {
    set({ loading: true });
    try {
      // Convert WooCommerce customer to Supabase format
      const supabaseCustomer: Omit<SupabaseCustomer, 'id' | 'created_at'> = {
        name: wooCustomer.first_name,
        surname: wooCustomer.last_name,
        company_name: wooCustomer.billing.company || null,
        email: wooCustomer.email,
        phone: wooCustomer.billing.phone || null,
        street_address: wooCustomer.billing.address_1 || null,
        complex_or_building: wooCustomer.billing.address_2 || null,
        suburb: null,
        area: wooCustomer.billing.state || null,
        city: wooCustomer.billing.city || null,
        postal_code: wooCustomer.billing.postcode || null,
        selection_count: 1,
        active: true,
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([supabaseCustomer])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      return data;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getCustomerById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  },

  updateCustomer: async (id: string, updates: Partial<SupabaseCustomer>) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchCustomers();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));