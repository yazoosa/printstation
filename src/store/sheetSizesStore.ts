import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { PaperSize } from '@/types/database.types';

interface SheetSizesStore {
  sheetSizes: PaperSize[];
  loading: boolean;
  error: string | null;
  fetchSheetSizes: () => Promise<void>;
  addSheetSize: (data: Omit<PaperSize, 'id' | 'created_at'>) => Promise<void>;
  updateSheetSize: (id: string, data: Partial<PaperSize>) => Promise<void>;
  deleteSheetSize: (id: string) => Promise<void>;
}

export const useSheetSizesStore = create<SheetSizesStore>((set, get) => ({
  sheetSizes: [],
  loading: false,
  error: null,
  fetchSheetSizes: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('paper_sizes')
        .select('*')
        .order('display_order');

      if (error) throw error;
      set({ sheetSizes: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addSheetSize: async (data) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('paper_sizes').insert([data]);
      if (error) throw error;
      await get().fetchSheetSizes();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateSheetSize: async (id, data) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('paper_sizes')
        .update(data)
        .eq('id', id);
      if (error) throw error;
      await get().fetchSheetSizes();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deleteSheetSize: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('paper_sizes').delete().eq('id', id);
      if (error) throw error;
      await get().fetchSheetSizes();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));