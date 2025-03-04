
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define types for the Supabase realtime payloads
interface BacktestPayload {
  new: {
    direction: string;
    symbol: string;
    is_success: boolean;
    [key: string]: any;
  };
  old?: Record<string, any>;
  [key: string]: any;
}

interface EntryPointPayload {
  new: {
    symbol: string;
    [key: string]: any;
  };
  old?: Record<string, any>;
  [key: string]: any;
}

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
          event: '*',
          schema: 'public',
          table: 'backtest_results',
          filter: `user_id=eq.${user.id}`
        },
        (payload: BacktestPayload) => {
          console.log('Realtime change detected in backtest_results:', payload);
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
          event: '*',
          schema: 'public',
          table: 'best_entry_point_results',
          filter: `user_id=eq.${user.id}`
        },
        (payload: EntryPointPayload) => {
          console.log('Realtime change detected in best_entry_point_results:', payload);
          const symbol = payload.new.symbol;
          
          toast.success(`تم تسجيل أفضل نقطة دخول ناجحة على ${symbol}`, {
            position: "top-center",
            duration: 5000
          });
        }
      )
      .subscribe();

    // إعداد قناة لمراقبة التغييرات في سجل البحث (الحذف/الإضافة/التحديث)
    const searchHistoryChannel = supabase
      .channel('search_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'search_history',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime change detected in search_history:', payload);
          
          // معالجة تحديثات معينة مثل تحقيق الهدف
          if (payload.eventType === 'UPDATE' && payload.new.target_hit && !payload.old.target_hit) {
            toast.success(`تم تحقيق هدف التحليل على ${payload.new.symbol}`, {
              position: "top-center",
              duration: 5000
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(backtestChannel);
      supabase.removeChannel(entryPointChannel);
      supabase.removeChannel(searchHistoryChannel);
    };
  }, [user]);

  const triggerManualCheck = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
      return;
    }

    try {
      setIsLoading(true);
      
      toast.info("جاري فحص التحليلات ومقارنتها بالأسعار الحالية...", {
        duration: 3000
      });
      
      const { data, error } = await supabase.functions.invoke('check-analysis-targets');
      
      if (error) {
        console.error('Error checking analyses:', error);
        toast.error("حدث خطأ أثناء فحص التحليلات");
        return;
      }
      
      console.log('Check analysis response:', data);
      
      const { checked, updated, updates } = data;
      
      if (updated > 0) {
        // عرض التحليلات التي تم تحديثها بنجاح
        const successfulAnalyses = updates?.filter(u => u.status === "success") || [];
        const failedAnalyses = updates?.filter(u => u.status === "failure") || [];
        
        if (successfulAnalyses.length > 0) {
          toast.success(`تم تحقيق الأهداف لـ ${successfulAnalyses.length} تحليل`, {
            duration: 5000
          });
        }
        
        if (failedAnalyses.length > 0) {
          toast.error(`تم ضرب وقف الخسارة لـ ${failedAnalyses.length} تحليل`, {
            duration: 5000
          });
        }
      } else {
        toast.info(`تم فحص ${checked || 0} تحليل، لم يتم تحديث أي تحليل`);
      }
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
