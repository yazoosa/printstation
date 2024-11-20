import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VAT_RATE = 0.15;

export function calculateVATFromTotal(total: number) {
  const subtotal = total / (1 + VAT_RATE);
  const vat = total - subtotal;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    vat: Number(vat.toFixed(2))
  };
}