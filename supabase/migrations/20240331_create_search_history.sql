-- Create an enum type for analysis types
CREATE TYPE analysis_type AS ENUM (
  'عادي',
  'سكالبينج',
  'ذكي',
  'SMC',
  'ICT',
  'Turtle Soup'
);

-- Create the search_history table
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  current_price DECIMAL NOT NULL,
  analysis JSONB NOT NULL,
  analysis_type analysis_type NOT NULL,
  target_hit BOOLEAN DEFAULT false,
  stop_loss_hit BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_symbol ON search_history(symbol);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- Enable Row Level Security
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own search history"
  ON search_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
  ON search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own search history"
  ON search_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
  ON search_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to add new analysis types
CREATE OR REPLACE FUNCTION add_analysis_type(new_type TEXT)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'analysis_type' 
        AND typelem = (
            SELECT oid FROM pg_type 
            WHERE typname = new_type
        )
    ) THEN
        EXECUTE format('ALTER TYPE analysis_type ADD VALUE IF NOT EXISTS %L', new_type);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_search_history_updated_at
    BEFORE UPDATE ON search_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();