import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { FinishingOption } from '@/types/database.types';

interface FinishingOptionsStore {
  options: FinishingOption[];
  loading: boolean;
  error: string | null;
  fetchOptions: () => Promise<void>;
  addOption: (data: Omit<FinishingOption, 'id'>) => Promise<void>;
  updateOption: (id: string, data: Partial<FinishingOption>) => Promise<void>;
  deleteOption: (id: string) => Promise<void>;
}

export const useFinishingOptionsStore = create<FinishingOptionsStore>((set, get) => ({
  options: [],
  loading: false,
  error: null,
  fetchOptions: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('finishing_options')
        .select('*')
        .order('category')
        .order('sub_category');

      if (error) throw error;
      set({ options: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addOption: async (data) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('finishing_options').insert([data]);
      if (error) throw error;
      await get().fetchOptions();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateOption: async (id, data) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('finishing_options')
        .update(data)
        .eq('id', id);
      if (error) throw error;
      await get().fetchOptions();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deleteOption: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('finishing_options').delete().eq('id', id);
      if (error) throw error;
      await get().fetchOptions();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));