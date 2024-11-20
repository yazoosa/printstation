import { CartItemData } from '../CartItem';

export const saveCart = (items: CartItemData[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

export const loadCart = (): CartItemData[] => {
  const saved = localStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};