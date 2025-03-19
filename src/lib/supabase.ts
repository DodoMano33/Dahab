
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('بيانات اعتماد Supabase مفقودة');
  throw new Error('بيانات اعتماد Supabase مفقودة');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: {
      'x-application-name': 'chart-analyzer',
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// الاستماع للتغييرات في حالة المصادقة
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('تغيير حالة المصادقة:', event, session?.user?.email);
    
    if (event === 'SIGNED_OUT') {
      // مسح أي رموز مخزنة
      localStorage.removeItem('supabase.auth.token');
    }
    
    if (event === 'TOKEN_REFRESHED') {
      console.log('تم تحديث الرمز بنجاح');
    }
  });
}
