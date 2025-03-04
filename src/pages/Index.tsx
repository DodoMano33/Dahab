
import { useState, useEffect, lazy, Suspense, memo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { RefreshCw, HelpCircle } from "lucide-react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { NotificationCenter } from "@/components/ui/notifications/NotificationCenter";
import { UserProfileMenu } from "@/components/ui/UserProfileMenu";
import { OnboardingDialog } from "@/components/ui/onboarding/Onboarding";
import { HelpButton } from "@/components/ui/onboarding/Onboarding";

// استخدام التحميل البطيء للمكونات الثقيلة
const ChartAnalyzer = lazy(() => import("@/components/ChartAnalyzer").then(module => ({ default: module.ChartAnalyzer })));
const UserDashboard = lazy(() => import("@/components/chart/dashboard/UserDashboard").then(module => ({ default: module.UserDashboard })));

// استخدام مكون memo لتحسين الأداء
const Header = memo(({ 
  isLoggedIn, 
  user, 
  onLoginClick, 
  onManualCheck, 
  isLoading, 
  lastCheckTime 
}: {
  isLoggedIn: boolean;
  user: any;
  onLoginClick: () => void;
  onManualCheck: () => void;
  isLoading: boolean;
  lastCheckTime: Date | null;
}) => (
  <header className="border-b">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">تحليل الأسواق المالية</h1>
      <div className="flex items-center gap-3">
        {isLoggedIn && lastCheckTime && (
          <Button 
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={onManualCheck}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        )}
        <HelpButton />
        <ModeToggle />
        {isLoggedIn && <NotificationCenter />}
        {!isLoggedIn ? (
          <Button onClick={onLoginClick} size="sm">
            تسجيل الدخول
          </Button>
        ) : (
          <UserProfileMenu />
        )}
      </div>
    </div>
  </header>
));

function Index() {
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { triggerManualCheck, isLoading, lastCheckTime } = useBackTest();
  const [activePage, setActivePage] = useState<'analysis' | 'dashboard'>('analysis');

  // تعديل الدالة لتتوافق مع نوع onClick في الزر
  const handleManualCheck = () => {
    triggerManualCheck();
  };
  
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
        onManualCheck={handleManualCheck}
        isLoading={isLoading}
        lastCheckTime={lastCheckTime}
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
        <Suspense fallback={<div className="flex items-center justify-center py-20">جاري تحميل المحتوى...</div>}>
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
                  ? <UserDashboard /> 
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
        </Suspense>
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
