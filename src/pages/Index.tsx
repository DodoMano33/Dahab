
import { useState } from 'react';
import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useBackTest } from "@/components/hooks/useBackTest";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { triggerManualCheck, isLoading } = useBackTest();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold text-gray-800">محلل الشارت الذكي</h1>
          <div className="flex gap-2">
            {user && (
              <Button 
                onClick={triggerManualCheck} 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                فحص التحليلات
              </Button>
            )}
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
          {/* Analysis Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <ChartAnalyzer />
          </div>
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
};

export default Index;
