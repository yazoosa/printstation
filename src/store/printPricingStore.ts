import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { PrintColour } from '@/types/database.types';

interface PrintPricingStore {
  printPrices: PrintColour[];
  loading: boolean;
  error: string | null;
  fetchPrintPrices: () => Promise<void>;
  addPrintPrice: (data: Omit<PrintColour, 'id' | 'created_at'>) => Promise<void>;
  updatePrintPrice: (id: string, data: Partial<PrintColour>) => Promise<void>;
  deletePrintPrice: (id: string) => Promise<void>;
}

export const usePrintPricingStore = create<PrintPricingStore>((set, get) => ({
  printPrices: [],
  loading: false,
  error: null,
  fetchPrintPrices: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('print_colour')
        .select('*')
        .order('size');

      if (error) throw error;
      set({ printPrices: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addPrintPrice: async (data) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('print_colour').insert([data]);
      if (error) throw error;
      await get().fetchPrintPrices();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updatePrintPrice: async (id, data) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('print_colour')
        .update(data)
        .eq('id', id);
      if (error) throw error;
      await get().fetchPrintPrices();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deletePrintPrice: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('print_colour').delete().eq('id', id);
      if (error) throw error;
      await get().fetchPrintPrices();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));