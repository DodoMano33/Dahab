import { useState } from 'react';
import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { LiveTradingViewChart } from "@/components/chart/LiveTradingViewChart";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, LineChart, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const AuthButton = () => (
    user ? (
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">تسجيل الخروج</span>
      </Button>
    ) : (
      <Button 
        onClick={() => setIsAuthModalOpen(true)} 
        variant="outline" 
        className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">تسجيل الدخول</span>
      </Button>
    )
  );

  const Header = () => (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <LineChart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          محلل الشارت الذكي
        </h1>
      </div>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[385px]">
            <div className="flex flex-col gap-4 mt-6">
              <AuthButton />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <AuthButton />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
          <Header />
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="h-[300px] sm:h-[500px]">
            <LiveTradingViewChart symbol="XAUUSD" timeframe="D" />
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
          <ChartAnalyzer />
        </div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </div>
  );
};

export default Index;