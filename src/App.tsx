
import { BrowserRouter as Router } from 'react-router-dom';
import { clearSupabaseCache, clearSearchHistoryCache } from './utils/supabaseCache';
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnboardingDialog } from "./components/ui/onboarding/OnboardingDialog";
import "./App.css";

// إنشاء مثيل QueryClient مع إعدادات محسنة
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 دقائق
      retry: 1,
      retryDelay: 1000,
    },
  },
});

function App() {
  // منطق التحميل المسبق للصور الشائعة الاستخدام
  useEffect(() => {
    const preloadImages = [
      "/onboarding/welcome.svg",
      "/onboarding/chart.svg",
      "/onboarding/history.svg",
      "/onboarding/dashboard.svg",
      "/onboarding/ready.svg",
    ];
    
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // مسح التخزين المؤقت لمخطط Supabase عند بدء التطبيق
    async function initializeCache() {
      console.log("Initializing app: clearing Supabase schema cache");
      
      try {
        // مسح التخزين المؤقت بشكل متتابع للتأكد من تحديث المخطط
        await clearSupabaseCache();
        await clearSearchHistoryCache();
        
        // محاولة ثانية بعد ثانية واحدة للتأكد
        setTimeout(async () => {
          await clearSupabaseCache();
          await clearSearchHistoryCache();
        }, 1000);
      } catch (error) {
        console.error("Error clearing cache during initialization:", error);
      }
    }
    
    initializeCache();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Toaster 
              position="top-center" 
              dir="rtl" 
              theme="system"
              closeButton
              richColors
              expand
              visibleToasts={5}
              duration={1000}
            />
            <Index />
            <OnboardingDialog />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
