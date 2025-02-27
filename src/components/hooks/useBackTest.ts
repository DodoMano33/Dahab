
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useBackTest = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // إعداد قنوات المراقبة للتغييرات في الوقت الحقيقي
    const backtestChannel = supabase
      .channel('backtest_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'backtest_results',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New backtest result:', payload);
          const direction = payload.new.direction;
          const symbol = payload.new.symbol;
          const isSuccess = payload.new.is_success;
          
          if (isSuccess) {
            toast.success(`تم تحقيق هدف التحليل ${direction} على ${symbol}`, {
              position: "top-center",
              duration: 5000
            });
          } else {
            toast.error(`تم الوصول إلى وقف الخسارة للتحليل ${direction} على ${symbol}`, {
              position: "top-center",
              duration: 5000
            });
          }
        }
      )
      .subscribe();

    const entryPointChannel = supabase
      .channel('entry_point_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'best_entry_point_results',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New best entry point result:', payload);
          const symbol = payload.new.symbol;
          
          toast.success(`تم تسجيل أفضل نقطة دخول ناجحة على ${symbol}`, {
            position: "top-center",
            duration: 5000
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(backtestChannel);
      supabase.removeChannel(entryPointChannel);
    };
  }, [user]);

  const triggerManualCheck = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-analysis-targets');
      
      if (error) {
        console.error('Error checking analyses:', error);
        toast.error("حدث خطأ أثناء فحص التحليلات");
        return;
      }
      
      console.log('Check analysis response:', data);
      toast.success(`تم فحص ${data.checked || 0} تحليل، وتحديث ${data.updated || 0} منها`);
    } catch (error) {
      console.error('Error checking analyses:', error);
      toast.error("حدث خطأ أثناء فحص التحليلات");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    triggerManualCheck,
    isLoading
  };
};
