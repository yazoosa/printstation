-- Add discount fields to saved_quotes table
ALTER TABLE saved_quotes
ADD COLUMN discount_percent DECIMAL(5,2),
ADD COLUMN discount_value DECIMAL(10,2),
ADD COLUMN discounted_subtotal DECIMAL(10,2);

-- Add comment to explain the fields
COMMENT ON COLUMN saved_quotes.discount_percent IS 'Percentage of discount applied to the quote';
COMMENT ON COLUMN saved_quotes.discount_value IS 'Monetary value of the discount';
COMMENT ON COLUMN saved_quotes.discounted_subtotal IS 'Subtotal after discount is applied';
