
import { createClient } from '@supabase/supabase-js';

// استخدام المتغيرات البيئية مباشرة من next.config.js
const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('بيانات اعتماد Supabase مفقودة');
  throw new Error('بيانات اعتماد Supabase مفقودة');
}

// تكوين العميل مع إعدادات محسنة للمصادقة
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
  },
  db: {
    schema: 'public'
  }
});

// تسجيل حالة المصادقة في كل تغيير للمساعدة في تشخيص المشكلات
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

// وظيفة مساعدة لتحديث رمز المصادقة
export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('فشل في تحديث جلسة المصادقة:', error);
      return false;
    }
    
    console.log('تم تحديث جلسة المصادقة بنجاح');
    return !!data.session;
  } catch (err) {
    console.error('خطأ أثناء تحديث جلسة المصادقة:', err);
    return false;
  }
};

// وظيفة للتحقق من الاتصال بالخادم
export const checkConnection = async (): Promise<boolean> => {
  try {
    // استخدام استعلام بسيط للتحقق من حالة الاتصال
    const { error } = await supabase.from('search_history').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('فشل في الاتصال بالخادم:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('خطأ أثناء التحقق من الاتصال:', err);
    return false;
  }
};
