import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Complexity } from '@/types/database.types';

interface ComplexityStore {
  complexities: Complexity[];
  loading: boolean;
  error: string | null;
  fetchComplexities: () => Promise<void>;
  addComplexity: (data: Omit<Complexity, 'id' | 'created_at'>) => Promise<void>;
  updateComplexity: (id: string, data: Partial<Complexity>) => Promise<void>;
  deleteComplexity: (id: string) => Promise<void>;
}

export const useComplexityStore = create<ComplexityStore>((set, get) => ({
  complexities: [],
  loading: false,
  error: null,
  fetchComplexities: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('complexity')
        .select('*')
        .order('breakpoint');

      if (error) throw error;
      set({ complexities: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addComplexity: async (data) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('complexity').insert([data]);
      if (error) throw error;
      await get().fetchComplexities();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateComplexity: async (id, data) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('complexity')
        .update(data)
        .eq('id', id);
      if (error) throw error;
      await get().fetchComplexities();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deleteComplexity: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('complexity').delete().eq('id', id);
      if (error) throw error;
      await get().fetchComplexities();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));