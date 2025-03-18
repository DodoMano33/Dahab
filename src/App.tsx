
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import "./App.css";

// إنشاء مثيل QueryClient مع إعدادات محسنة لتجنب الأخطاء
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 دقائق
      retry: 1,
      retryDelay: 1000,
      useErrorBoundary: false, // تعطيل حدود الخطأ لمنع انهيار التطبيق
    },
  },
});

// مكون انتظار التحميل المحسن
const LoadingFallback = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
    <div className="text-lg text-muted-foreground">جاري التحميل...</div>
  </div>
);

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  // منطق التحميل المسبق للصور الشائعة الاستخدام
  useEffect(() => {
    const preloadImages = [
      "/onboarding/welcome.svg",
      "/onboarding/chart.svg",
      "/onboarding/history.svg",
      "/onboarding/dashboard.svg",
      "/onboarding/ready.svg",
    ];
    
    let loadedImagesCount = 0;
    
    // تحميل الصور مسبقًا وتتبع اكتمالها
    preloadImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedImagesCount++;
        // إذا تم تحميل جميع الصور، قم بتعيين التطبيق كجاهز
        if (loadedImagesCount === preloadImages.length) {
          setTimeout(() => setIsAppReady(true), 300);
        }
      };
      img.onerror = () => {
        loadedImagesCount++;
        // حتى لو فشل تحميل الصور، سنستمر
        if (loadedImagesCount === preloadImages.length) {
          setTimeout(() => setIsAppReady(true), 300);
        }
      };
      img.src = src;
    });
    
    // عرض التطبيق بعد فترة قصيرة حتى لو لم تكتمل الصور
    const timer = setTimeout(() => setIsAppReady(true), 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <LoadingFallback />;
  }

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
            <Index />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
