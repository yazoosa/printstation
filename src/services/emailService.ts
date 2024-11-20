import type { SavedQuote } from '../types/quote.types';
import type { CartItemData } from '../components/cart/CartItem';

const API_URL = 'http://localhost:3001/api';

export async function sendQuoteEmail(quote: SavedQuote): Promise<void> {
  try {
    console.log('Sending quote email to:', quote.customers.email);
    const response = await fetch(`${API_URL}/send-quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quote),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.error || 'Failed to send quote email');
    }

    console.log('Quote email sent successfully:', data);
  } catch (error) {
    console.error('Detailed error in sendQuoteEmail:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send quote email: ${error.message}`);
    }
    throw new Error('Failed to send quote email: Unknown error');
  }
}

export async function sendCartEmail(items: CartItemData[], email: string): Promise<void> {
  try {
    console.log('Sending cart email to:', email);
    const response = await fetch(`${API_URL}/send-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.error || 'Failed to send cart email');
    }

    console.log('Cart email sent successfully:', data);
  } catch (error) {
    console.error('Detailed error in sendCartEmail:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send cart email: ${error.message}`);
    }
    throw new Error('Failed to send cart email: Unknown error');
  }
}
