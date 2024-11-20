-- Fix quote_history table schema
ALTER TABLE quote_history DROP CONSTRAINT IF EXISTS chk_valid_status;

-- Update column types
ALTER TABLE quote_history 
  ALTER COLUMN status_from TYPE text,
  ALTER COLUMN status_to TYPE text,
  ALTER COLUMN changed_by TYPE text,
  ALTER COLUMN notes TYPE text;

-- Add check constraint for valid status values
ALTER TABLE quote_history
  ADD CONSTRAINT chk_valid_status 
  CHECK (
    status_to IN ('draft', 'approved', 'rejected', 'printed', 'emailed', 'woo')
  );

-- Add foreign key constraint
ALTER TABLE quote_history
  DROP CONSTRAINT IF EXISTS fk_quote_history_quote,
  ADD CONSTRAINT fk_quote_history_quote 
  FOREIGN KEY (quote_id) 
  REFERENCES saved_quotes(quote_id) 
  ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quote_history_quote_id ON quote_history(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_history_date_changed ON quote_history(date_changed DESC);

-- Update existing null status_from values to 'draft'
UPDATE quote_history 
SET status_from = 'draft' 
WHERE status_from IS NULL;