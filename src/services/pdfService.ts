import { pdf } from '@react-pdf/renderer';
import type { SavedQuote } from '@/types/quote.types';
import { QuotePDF } from '@/components/saved-quotes/QuotePDF';
import { createElement, type ReactElement } from 'react';

export async function generateQuotePDF(quote: SavedQuote): Promise<void> {
  try {
    // Validate quote data
    if (!quote) {
      throw new Error('Quote data is required');
    }

    // Validate required quote fields
    const requiredFields = [
      'quote_reference',
      'date_created',
      'subtotal',
      'vat',
      'total',
      'quote_items'
    ] as const;

    for (const field of requiredFields) {
      if (!(field in quote)) {
        throw new Error(`Missing required quote field: ${field}`);
      }
    }

    // Validate quote items
    if (!Array.isArray(quote.quote_items) || quote.quote_items.length === 0) {
      throw new Error('Quote must have at least one item');
    }

    // Validate customer data
    if (!quote.customers) {
      throw new Error('Customer data is missing');
    }

    const requiredCustomerFields = [
      'name',
      'surname',
      'email'
    ] as const;

    for (const field of requiredCustomerFields) {
      if (!(field in quote.customers)) {
        throw new Error(`Missing required customer field: ${field}`);
      }
    }

    // Generate PDF with error handling
    let blob;
    try {
      const pdfDoc = createElement(QuotePDF, { quote }) as ReactElement;
      const pdfInstance = await pdf(pdfDoc);
      blob = await pdfInstance.toBlob();
    } catch (error) {
      console.error('PDF rendering error:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to render PDF: ${error.message}`
          : 'Failed to render PDF document'
      );
    }

    if (!blob) {
      throw new Error('Failed to generate PDF blob');
    }

    // Create and trigger download with error handling
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Quote-${quote.quote_reference}.pdf`;
      
      // Append, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to download PDF: ${error.message}`
          : 'Failed to download PDF'
      );
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}