
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null,
  session: null,
  loading: true,
  isLoggedIn: false,
  refreshAuth: async () => false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // وظيفة لتحديث حالة المصادقة
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('خطأ في تحديث جلسة المصادقة:', error);
        return false;
      }
      
      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);
        setIsLoggedIn(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('استثناء أثناء تحديث المصادقة:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    console.log("AuthProvider: تهيئة حالة المصادقة");
    
    // الحصول على الجلسة الأولية
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('خطأ في الحصول على الجلسة:', error);
        toast.error('حدث خطأ أثناء تحميل بيانات المستخدم');
      }
      
      const hasUser = !!session?.user;
      setUser(session?.user ?? null);
      setSession(session);
      setIsLoggedIn(hasUser);
      setLoading(false);
      
      console.log('حالة المصادقة الأولية:', { 
        hasUser, 
        userId: session?.user?.id,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
      });
    }).catch(err => {
      console.error('استثناء أثناء الحصول على الجلسة:', err);
      setLoading(false);
    });

    // إعداد اشتراك للمصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("AuthProvider: تغيير حالة المصادقة", { event, hasSession: !!newSession });
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setIsLoggedIn(false);
        // مسح أي رموز مخزنة
        localStorage.removeItem('supabase.auth.token');
        toast.info('تم تسجيل الخروج');
      } else if (event === 'SIGNED_IN') {
        setUser(newSession?.user ?? null);
        setSession(newSession);
        setIsLoggedIn(!!newSession?.user);
        toast.success('تم تسجيل الدخول بنجاح');
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(newSession?.user ?? null);
        setSession(newSession);
        setIsLoggedIn(!!newSession?.user);
        console.log('تم تحديث الرمز بنجاح', {
          userId: newSession?.user?.id,
          expiresAt: newSession?.expires_at ? new Date(newSession.expires_at * 1000).toISOString() : 'N/A'
        });
      } else if (event === 'USER_UPDATED') {
        setUser(newSession?.user ?? null);
        setSession(newSession);
      }
      
      setLoading(false);
    });

    // التحقق من تفعيل وضع عدم الاتصال في المتصفح
    window.addEventListener('offline', () => {
      console.log('تم اكتشاف وضع عدم الاتصال');
    });
    
    window.addEventListener('online', () => {
      console.log('تم استعادة الاتصال، التحقق من حالة المصادقة');
      refreshAuth();
    });

    return () => {
      console.log("AuthProvider: تنظيف اشتراك المصادقة");
      subscription.unsubscribe();
    };
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, session, loading, isLoggedIn, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('يجب استخدام useAuth داخل AuthProvider');
  }
  return context;
};
