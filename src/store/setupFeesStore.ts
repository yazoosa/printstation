import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { SetupFees } from '@/types/database.types';

interface SetupFeesStore {
  setupFees: SetupFees | null;
  loading: boolean;
  error: string | null;
  fetchSetupFees: () => Promise<void>;
  updateSetupFees: (data: Partial<SetupFees>) => Promise<void>;
  createSetupFees: (data: Omit<SetupFees, 'id' | 'created_at'>) => Promise<void>;
  deleteSetupFees: (id: string) => Promise<void>;
}

export const useSetupFeesStore = create<SetupFeesStore>((set, get) => ({
  setupFees: null,
  loading: false,
  error: null,
  fetchSetupFees: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('setup_fees')
        .select('*')
        .single();

      if (error) throw error;
      set({ setupFees: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateSetupFees: async (data) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('setup_fees')
        .update(data)
        .eq('id', get().setupFees?.id);
      if (error) throw error;
      await get().fetchSetupFees();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  createSetupFees: async (data) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('setup_fees').insert([data]);
      if (error) throw error;
      await get().fetchSetupFees();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deleteSetupFees: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('setup_fees').delete().eq('id', id);
      if (error) throw error;
      set({ setupFees: null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));