-- Create stored procedure for customer creation with mapping
CREATE OR REPLACE FUNCTION create_customer_with_mapping(
  p_woo_customer_id INTEGER,
  p_name TEXT,
  p_surname TEXT,
  p_company_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_street_address TEXT,
  p_complex_or_building TEXT,
  p_city TEXT,
  p_area TEXT,
  p_postal_code TEXT
) RETURNS customers AS $$
DECLARE
  v_customer customers;
BEGIN
  -- Insert new customer
  INSERT INTO customers (
    name,
    surname,
    company_name,
    email,
    phone,
    street_address,
    complex_or_building,
    city,
    area,
    postal_code,
    selection_count,
    active
  ) VALUES (
    p_name,
    p_surname,
    p_company_name,
    p_email,
    p_phone,
    p_street_address,
    p_complex_or_building,
    p_city,
    p_area,
    p_postal_code,
    1,
    true
  )
  RETURNING * INTO v_customer;

  -- Create mapping
  INSERT INTO customer_woo_mapping (
    woo_customer_id,
    supabase_customer_id
  ) VALUES (
    p_woo_customer_id,
    v_customer.id
  );

  RETURN v_customer;
END;
$$ LANGUAGE plpgsql;