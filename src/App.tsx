
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { clearSupabaseCache } from './utils/supabaseCache';
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import { lazy, Suspense, useEffect } from "react";
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

// مكون انتظار التحميل
const LoadingFallback = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
    <div className="text-lg text-muted-foreground">جاري التحميل...</div>
  </div>
);

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
      await clearSupabaseCache();
      
      // محاولة ثانية بعد ثانية واحدة للتأكد
      setTimeout(async () => {
        await clearSupabaseCache();
      }, 1000);
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
              duration={5000}
            />
            <Suspense fallback={<LoadingFallback />}>
              <Index />
              <OnboardingDialog />
            </Suspense>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
