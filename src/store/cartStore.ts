import { create } from 'zustand';
import { CartItemData } from '@/components/cart/CartItem';
import { saveCart, loadCart, clearCart } from '@/components/cart/services/cartStorage';

interface CartStore {
  items: CartItemData[];
  addItem: (item: Omit<CartItemData, 'id'>) => void;
  updateItem: (id: string, updates: Partial<CartItemData>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  loadItems: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  
  addItem: (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    };
    set((state) => {
      const newItems = [...state.items, newItem];
      saveCart(newItems);
      return { items: newItems };
    });
  },

  updateItem: (id, updates) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      saveCart(newItems);
      return { items: newItems };
    });
  },

  clearItems: () => {
    clearCart();
    set({ items: [] });
  },

  loadItems: () => {
    const savedItems = loadCart();
    set({ items: savedItems });
  },
}));