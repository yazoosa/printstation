import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { PaperCatalog } from '@/types/database.types';

interface PaperStore {
  papers: PaperCatalog[];
  loading: boolean;
  error: string | null;
  fetchPapers: () => Promise<void>;
  addPaper: (data: Omit<PaperCatalog, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePaper: (id: string, data: Partial<PaperCatalog>) => Promise<void>;
  deletePaper: (id: string) => Promise<void>;
}

export const usePaperStore = create<PaperStore>((set, get) => ({
  papers: [],
  loading: false,
  error: null,
  fetchPapers: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('paper_catalog')
        .select('*')
        .order('order_sequence');

      if (error) throw error;
      set({ papers: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addPaper: async (data) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('paper_catalog').insert([data]);
      if (error) throw error;
      await get().fetchPapers();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updatePaper: async (id, data) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('paper_catalog')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      await get().fetchPapers();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deletePaper: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('paper_catalog').delete().eq('id', id);
      if (error) throw error;
      await get().fetchPapers();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));