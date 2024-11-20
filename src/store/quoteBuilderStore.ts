// src/store/quoteBuilderStore.ts
import { create } from 'zustand';

interface LayoutResult {
  repeats: number;
  across: number;
  down: number;
  isLandscape: boolean;
}

interface QuoteBuilderStore {
  layoutResult: LayoutResult | null;
  sheetsRequired: number;
  selectedSheetSize: string;
  quantity: number;
  setLayoutResult: (result: LayoutResult | null) => void;
  setSheetsRequired: (sheets: number) => void;
  setSelectedSheetSize: (size: string) => void;
  setQuantity: (qty: number) => void;
}

export const useQuoteBuilderStore = create<QuoteBuilderStore>((set) => ({
  layoutResult: null,
  sheetsRequired: 0,
  selectedSheetSize: 'SRA3',
  quantity: 0,
  setLayoutResult: (result) => set({ layoutResult: result }),
  setSheetsRequired: (sheets) => set({ sheetsRequired: sheets }),
  setSelectedSheetSize: (size) => set({ selectedSheetSize: size }),
  setQuantity: (qty) => set({ quantity: qty })
}));