import { useState } from 'react';
import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { LiveTradingViewChart } from "@/components/chart/LiveTradingViewChart";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, LineChart } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LineChart className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                محلل الشارت الذكي
              </h1>
            </div>
            {user ? (
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            ) : (
              <Button 
                onClick={() => setIsAuthModalOpen(true)} 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <LiveTradingViewChart symbol="XAUUSD" timeframe="D" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <ChartAnalyzer />
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
};

export default Index;