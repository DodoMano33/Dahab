import { useState } from 'react';
import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { LiveTradingViewChart } from "@/components/chart/LiveTradingViewChart";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">محلل الشارت الذكي</h1>
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

        <div className="space-y-4">
          <LiveTradingViewChart symbol="XAUUSD" timeframe="D" />
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ChartAnalyzer />
          </div>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
};

export default Index;