import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU3MzgzMzAsImV4cCI6MjAyMTMxNDMzMH0.qYnBHPmKkWOC_mYhGz7ZNFZp7KQ6bBKGqCvUF6SKZjc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});