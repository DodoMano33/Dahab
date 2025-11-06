
import { useState, useEffect, lazy, Suspense, memo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { HelpButton } from "@/components/ui/onboarding/Onboarding";

// استخدام استيراد ثابت بدلاً من الاستيراد الديناميكي
import ChartAnalyzer from "@/components/ChartAnalyzer";
const UserDashboard = lazy(() => import("@/components/chart/dashboard/UserDashboard").then(module => ({ default: module.UserDashboard })));

// استخدام مكون memo لتحسين الأداء
const Header = memo(() => (
  <header className="border-b">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">تحليل الأسواق المالية</h1>
      <div className="flex items-center gap-3">
        <HelpButton />
        <ModeToggle />
      </div>
    </div>
  </header>
));

function Index() {
  console.log("Index component rendering");
  const location = useLocation();
  const [activePage, setActivePage] = useState<'analysis' | 'dashboard'>('analysis');

  // استخدام useEffect لمعالجة تغيير المسار
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setActivePage('dashboard');
    } else {
      setActivePage('analysis');
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      <div className="container mx-auto px-4 py-3 border-b">
        <div className="flex space-x-4 space-x-reverse">
          <Button 
            variant={activePage === 'analysis' ? "default" : "ghost"} 
            onClick={() => setActivePage('analysis')}
            asChild
          >
            <a href="/">التحليل</a>
          </Button>
          <Button 
            variant={activePage === 'dashboard' ? "default" : "ghost"} 
            onClick={() => setActivePage('dashboard')}
            asChild
          >
            <a href="/dashboard">لوحة المعلومات</a>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <Routes>
          <Route 
            path="/" 
            element={<ChartAnalyzer />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <Suspense fallback={<div className="flex items-center justify-center py-20">جاري تحميل المحتوى...</div>}>
                <UserDashboard />
              </Suspense>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default Index;
