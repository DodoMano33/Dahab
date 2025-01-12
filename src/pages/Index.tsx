import { useState } from 'react';
import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { LiveTradingViewChart } from "@/components/chart/LiveTradingViewChart";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, Moon, Sun, Contrast } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Sun className="h-5 w-5" />;
      case 'bw':
        return <Moon className="h-5 w-5" />;
      default:
        return <Contrast className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold text-foreground">محلل الشارت الذكي</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {getThemeIcon()}
            </Button>
            {user ? (
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)} variant="outline" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 p-4">
          {/* TradingView Chart */}
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <LiveTradingViewChart symbol="XAUUSD" timeframe="D" />
          </div>

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