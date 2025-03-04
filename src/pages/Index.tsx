
import { useState, useEffect } from 'react';
import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, RefreshCw, Moon, Sun } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useBackTest } from "@/components/hooks/useBackTest";
import { useTheme } from "@/hooks/use-theme";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { triggerManualCheck, isLoading } = useBackTest();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold">محلل الشارت الذكي</h1>
          <div className="flex gap-2">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="w-10 h-10"
              title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user && (
              <Button 
                onClick={triggerManualCheck} 
                variant="outline" 
                className="flex items-center gap-2 md:px-4 px-2 md:text-base text-sm"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">فحص التحليلات</span>
              </Button>
            )}
            
            {user ? (
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="flex items-center gap-2 md:px-4 px-2 md:text-base text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">تسجيل الخروج</span>
              </Button>
            ) : (
              <Button 
                onClick={() => setIsAuthModalOpen(true)} 
                variant="outline" 
                className="flex items-center gap-2 md:px-4 px-2 md:text-base text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">تسجيل الدخول</span>
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 p-4">
          {/* Analysis Form */}
          <div className="bg-card rounded-lg shadow-sm">
            <ChartAnalyzer />
          </div>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
};

export default Index;
