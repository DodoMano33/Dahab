
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean; // Added this property
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  isLoggedIn: false // Initialize with false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state for isLoggedIn

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        toast.error('حدث خطأ أثناء تحميل بيانات المستخدم');
      }
      
      const hasUser = !!session?.user;
      setUser(session?.user ?? null);
      setIsLoggedIn(hasUser); // Set isLoggedIn based on session existence
      setLoading(false);
    });

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed", { event, hasSession: !!session });
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false); // Update isLoggedIn on sign out
        // Clear any stored tokens
        localStorage.removeItem('supabase.auth.token');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session?.user); // Update isLoggedIn on sign in
      }
      
      setLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
