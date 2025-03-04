import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useBackTest } from "@/components/hooks/useBackTest";

function Index() {
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { triggerManualCheck, isLoading, lastCheckTime } = useBackTest();

  // تعديل الدالة لتتوافق مع نوع onClick في الزر
  const handleManualCheck = () => {
    triggerManualCheck();
  };
  
  // Fetch user data on component mount if logged in
  useEffect(() => {
    if (isLoggedIn && !user) {
      // The useAuth hook should handle fetching user data when isLoggedIn is true
      // If it doesn't, you might need to add a fetchUserData function to the hook
      // and call it here.
      console.warn("User is logged in but user data is not available. Check your AuthContext.");
    }
  }, [isLoggedIn, user]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">تحليل الأسواق المالية</h1>
          <div className="flex items-center gap-4">
            {isLoggedIn && lastCheckTime && (
              <Button 
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={handleManualCheck}
                disabled={isLoading}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            )}
            <ModeToggle />
            {!isLoggedIn ? (
              <Button onClick={() => setShowAuthModal(true)} size="sm">
                تسجيل الدخول
              </Button>
            ) : (
              <span className="text-sm">{user?.email}</span>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-6">
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
    </div>
  );
}

export default Index;
