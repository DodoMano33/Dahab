
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import { lazy, Suspense } from "react"; // استخدام التحميل البطيء
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// إنشاء مثيل QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 دقائق
    },
  },
});

function App() {
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
            />
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">جاري التحميل...</div>}>
              <Index />
            </Suspense>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
