-- SQL migration to fix quote_history table structure
ALTER TABLE quote_history 
  ALTER COLUMN status_from TYPE text,
  ALTER COLUMN status_to TYPE text,
  ALTER COLUMN changed_by TYPE text,
  ALTER COLUMN notes TYPE text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quote_history_quote_id ON quote_history(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_history_date_changed ON quote_history(date_changed DESC);

-- Add constraints
ALTER TABLE quote_history
  ADD CONSTRAINT fk_quote_history_quote 
  FOREIGN KEY (quote_id) 
  REFERENCES saved_quotes(quote_id) 
  ON DELETE CASCADE;

-- Add check constraint for valid status values
ALTER TABLE quote_history
  ADD CONSTRAINT chk_valid_status 
  CHECK (
    status_to IN ('draft', 'approved', 'rejected', 'printed', 'emailed', 'woo')
  );