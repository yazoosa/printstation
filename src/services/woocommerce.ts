import type { SavedQuote } from '@/types/quote.types';

const API_BASE_URL = import.meta.env.VITE_WC_API_URL + '/orders';
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;
const PRINT_PRODUCT_ID = Number(import.meta.env.VITE_WC_PRINT_PRODUCT_ID);

if (!API_BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET || !PRINT_PRODUCT_ID) {
  throw new Error('Missing WooCommerce environment variables');
}

export async function createWooCommerceOrder(quote: SavedQuote) {
  try {
    // Validate required data
    if (!quote.customers) {
      throw new Error('Customer data is missing');
    }

    const params = new URLSearchParams({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
    });

    // Create line items with formatted descriptions
    const lineItems = quote.quote_items.map(item => ({
      product_id: PRINT_PRODUCT_ID,
      quantity: 1,
      price: (item.total / 1.15).toFixed(2),
      total: (item.total / 1.15).toFixed(2),
      subtotal: (item.total / 1.15).toFixed(2),
      meta_data: [
        {
          key: 'Description',
          value: item.description.split('\n')
            .filter(line => !line.includes('Subtotal:') && 
                          !line.includes('VAT:') && 
                          !line.includes('Total:') && 
                          !line.includes('Setup Fee:') && 
                          !line.includes('Price:'))
            .join('\n') + `\n\nReference: ${quote.quote_reference}`
        }
      ]
    }));

    // Format customer data for WooCommerce
    const customerData = {
      first_name: quote.customers.name || '',
      last_name: quote.customers.surname || '',
      email: quote.customers.email || '',
      phone: quote.customers.phone || '',
      company: quote.customers.company_name || '',
      address_1: quote.customers.street_address || '',
      address_2: quote.customers.complex_or_building || '',
      city: quote.customers.city || '',
      state: quote.customers.area || '',
      postcode: quote.customers.postal_code || '',
    };

    const response = await fetch(`${API_BASE_URL}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        payment_method: 'instore_payment',
        payment_method_title: 'In-store Payment',
        status: 'processing',
        billing: customerData,
        line_items: lineItems,
        meta_data: [
          {
            key: 'quote_reference',
            value: quote.quote_reference,
          },
          {
            key: 'quote_totals',
            value: JSON.stringify({
              subtotal: quote.subtotal,
              vat: quote.vat,
              total: quote.total
            })
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create WooCommerce order');
    }

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating WooCommerce order:', error);
    throw error;
  }
}