-- Drop existing table if it exists
DROP TABLE IF EXISTS public.search_history;

-- Create the search_history table
CREATE TABLE public.search_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid references auth.users(id) NOT NULL,
  symbol text NOT NULL,
  current_price numeric NOT NULL,
  analysis jsonb NOT NULL,
  analysis_type text NOT NULL check (analysis_type in ('عادي', 'سكالبينج', 'ذكي', 'SMC', 'ICT', 'Turtle Soup', 'Gann'))
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own search history
CREATE POLICY "Users can view their own search history"
  ON public.search_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own search history
CREATE POLICY "Users can insert their own search history"
  ON public.search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own search history
CREATE POLICY "Users can delete their own search history"
  ON public.search_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_created_at ON public.search_history(created_at);
