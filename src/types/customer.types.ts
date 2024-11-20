export interface CustomerBilling {
  phone: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
}

export interface WooCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  billing: CustomerBilling;
}

export interface SupabaseCustomer {
  id: string;
  name: string;
  surname: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  street_address: string | null;
  complex_or_building: string | null;
  suburb: string | null;
  area: string | null;
  city: string | null;
  postal_code: string | null;
  created_at: string;
  selection_count: number | null;
  active: boolean;
}

export type Customer = SupabaseCustomer;

export interface CustomerSearchResponse {
  data: WooCustomer[];
  total: number;
  totalPages: number;
}
