
-- Add missing columns to search_history table
ALTER TABLE public.search_history
  ADD COLUMN IF NOT EXISTS last_checked_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS last_checked_price numeric,
  ADD COLUMN IF NOT EXISTS analysis_duration_hours integer DEFAULT 8,
  ADD COLUMN IF NOT EXISTS timeframe text DEFAULT '1d',
  ADD COLUMN IF NOT EXISTS result_timestamp timestamp with time zone;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_search_history_last_checked_at 
  ON public.search_history(last_checked_at);
CREATE INDEX IF NOT EXISTS idx_search_history_result_timestamp 
  ON public.search_history(result_timestamp);

