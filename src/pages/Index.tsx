import { useState, useEffect, lazy, Suspense, memo } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { RefreshCw, HelpCircle } from "lucide-react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { UserProfileMenu } from "@/components/ui/UserProfileMenu";
import { OnboardingDialog } from "@/components/ui/onboarding/Onboarding";
import { HelpButton } from "@/components/ui/onboarding/Onboarding";

const ChartAnalyzer = lazy(() => import("@/components/ChartAnalyzer"));
const UserDashboard = lazy(() => import("@/components/chart/dashboard/UserDashboard").then(module => ({ default: module.UserDashboard })));

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
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { triggerManualCheck } = useBackTest();
  const [activePage, setActivePage] = useState<'analysis' | 'dashboard'>('analysis');

  const handleManualCheck = () => {
    console.log("تم إيقاف وظيفة فحص التحليلات");
  };
  
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setActivePage('dashboard');
    } else {
      setActivePage('analysis');
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
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
            >
              <Link to="/" className="w-full h-full flex items-center justify-center">التحليل</Link>
            </Button>
            <Button 
              variant={activePage === 'dashboard' ? "default" : "ghost"} 
              onClick={() => setActivePage('dashboard')}
            >
              <Link to="/dashboard" className="w-full h-full flex items-center justify-center">لوحة المعلومات</Link>
            </Button>
          </div>
        </div>
      )}
      
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
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <OnboardingDialog />
    </div>
  );
}

export default Index;
