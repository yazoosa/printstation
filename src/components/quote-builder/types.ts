import type { 
  PaperCatalog,
  PrintColour,
  Complexity,
  PaperSize,
  FinishingOption,
  SetupFees 
} from '../../types/database.types';
 
export interface LayoutResult {
  repeats: number;
  across: number;
  down: number;
  isLandscape: boolean;
}
 
export interface PricingCalculation {
  paperCost: number;
  printingBaseCost: number;
  setupFee: number;
  totalPrintingCost: number;
  complexityFactor: number;
  total: number;
}
 
export interface FinishingRow {
  id: string;
  category: string;
  subCategory: string;
  setupFee: number;
  quantity: number;
  price: number;
}
 
export interface GrandTotalActionsProps {
  quantity: number;
  width: number;
  length: number;
  selectedPaper: PaperCatalog | null;
  selectedPrintOption: string;
  finishingOptions: FinishingRow[];
  subtotal: number;
  vat: number;
  grandTotal: number;
  layoutResult: LayoutResult | null;
  sheetsRequired: number;
}
 
// Re-export types from database.types
export type {
  PaperCatalog,
  PrintColour,
  Complexity,
  PaperSize,
  FinishingOption,
  SetupFees
};
