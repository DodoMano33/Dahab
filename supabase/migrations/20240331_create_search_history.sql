create table public.search_history (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  symbol text not null,
  current_price numeric not null,
  analysis jsonb not null,
  analysis_type text not null check (analysis_type in ('عادي', 'سكالبينج', 'ذكي', 'SMC', 'ICT', 'Turtle Soup'))
);

-- Set up Row Level Security (RLS)
alter table public.search_history enable row level security;

-- Create policy to allow users to see only their own search history
create policy "Users can view their own search history"
  on public.search_history
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own search history
create policy "Users can insert their own search history"
  on public.search_history
  for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to delete their own search history
create policy "Users can delete their own search history"
  on public.search_history
  for delete
  using (auth.uid() = user_id);