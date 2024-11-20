export interface PaperCatalog {
  id: string;
  type: string;
  name: string;
  grammage: string;
  micron: string | null;
  size: string;
  cost: number;
  markup_percentage: number;
  price: number;
  order_sequence: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Complexity {
  id: string;
  breakpoint: number;
  percent: number;
  created_at: string;
}

export interface PrintColour {
  id: string;
  size: string;
  fc_ss_cost: number;
  fc_ss_price: number;
  fc_ds_cost: number;
  fc_ds_price: number;
  bw_ss_cost: number;
  bw_ss_price: number;
  bw_ds_cost: number;
  bw_ds_price: number;
  fc_bw_cost: number;
  fc_bw_price: number;
  width: number;
  length: number;
  created_at: string;
}

export interface SetupFees {
  id: string;
  created_at: string;
  [key: string]: string | number;
}

export interface PaperSize {
  id: string;
  type: string;
  name: string;
  width: number;
  length: number;
  created_at: string;
  display_order: number;
}

export interface FinishingOption {
  id: string;
  category: string;
  sub_category: string;
  setup_fee: number;
  cost: number;
  price: number;
}