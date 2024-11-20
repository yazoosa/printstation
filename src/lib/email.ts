import type { SavedQuote } from '../types/quote.types';
import { sendQuoteEmail as sendQuoteEmailService } from '../services/emailService';

export async function sendQuoteEmail(quote: SavedQuote): Promise<void> {
  try {
    await sendQuoteEmailService(quote);
  } catch (error) {
    console.error('Error sending quote email:', error);
    throw error;
  }
}
