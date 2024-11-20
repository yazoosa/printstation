import { forwardRef } from 'react';
import type { SavedQuote } from '../../types/quote.types';
import './QuotePrintView.css';

interface QuotePrintViewProps {
  quote: SavedQuote;
}

export const QuotePrintView = forwardRef<HTMLDivElement, QuotePrintViewProps>(
  (_, ref) => {
    return (
      <div ref={ref} className="pdf-print">
        <div className="pdf-container">
          <div className="pdf-content" />
        </div>
      </div>
    );
  }
);

QuotePrintView.displayName = 'QuotePrintView';
