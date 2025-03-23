import { useState, useEffect, lazy, Suspense, memo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { UserProfileMenu } from "@/components/ui/UserProfileMenu";
import { OnboardingDialog } from "@/components/ui/onboarding/Onboarding";
import { HelpButton } from "@/components/ui/onboarding/Onboarding";

// استخدام استيراد بسيط بدلاً من الاستيراد الديناميكي
import ChartAnalyzer from "../components/ChartAnalyzer";
const UserDashboard = lazy(() => import("@/components/chart/dashboard/UserDashboard").then(module => ({ default: module.UserDashboard })));

// استخدام مكون memo لتحسين الأداء
const Header = memo(({ 
  isLoggedIn, 
  user, 
  onLoginClick
}: {
  isLoggedIn: boolean;
  user: any;
  onLoginClick: () => void;
}) => (
  <header className="border-b">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">تحليل الأسواق المالية</h1>
      <div className="flex items-center gap-3">
        {isLoggedIn && (
          <Button 
            size="sm"
            variant="outline"
            className="text-xs cursor-default"
          >
            <RefreshCw className="h-3 w-3 ml-1" />
            تحديث
          </Button>
        )}
        <HelpButton />
        <ModeToggle />
        {isLoggedIn ? (
          <UserProfileMenu />
        ) : (
          <Button onClick={onLoginClick} size="sm">
            تسجيل الدخول
          </Button>
        )}
      </div>
    </div>
  </header>
));

function Index() {
  console.log("Index component rendering");
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
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
      <Header 
        isLoggedIn={isLoggedIn}
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
      />
      
      {isLoggedIn && (
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
      )}
      
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <Routes>
          <Route 
            path="/" 
            element={
              isLoggedIn 
                ? <ChartAnalyzer /> 
                : <Navigate to="/login" state={{ from: location }} replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn 
                ? <Suspense fallback={<div className="flex items-center justify-center py-20">جاري تحميل المحتوى...</div>}>
                    <UserDashboard />
                  </Suspense>
                : <Navigate to="/login" state={{ from: location }} replace />
            } 
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn
                ? <Navigate to="/" replace />
                : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <h2 className="text-2xl font-bold mb-8">مرحباً بك في منصة تحليل الأسواق المالية</h2>
                    <Button onClick={() => setShowAuthModal(true)}>
                      تسجيل الدخول للمتابعة
                    </Button>
                  </div>
                )
            } 
          />
        </Routes>
      </main>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      {/* Onboarding Dialog */}
      <OnboardingDialog />
    </div>
  );
}

export default Index;
