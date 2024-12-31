import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);