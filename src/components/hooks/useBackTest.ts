
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useBackTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  // جلب آخر وقت فحص عند تحميل المكون
  useEffect(() => {
    const fetchLastCheckTime = async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('last_checked_at')
        .order('last_checked_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0 && data[0].last_checked_at) {
        console.log("Initial last_checked_at:", data[0].last_checked_at);
        setLastCheckTime(new Date(data[0].last_checked_at));
      }
    };

    fetchLastCheckTime();
    
    // الاستماع لحدث تحديث التاريخ
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("useBackTest detected history update with timestamp:", customEvent.detail.timestamp);
        setLastCheckTime(new Date(customEvent.detail.timestamp));
      }
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, []);

  const triggerManualCheck = async () => {
    try {
      setIsLoading(true);
      
      // استدعاء وظيفة الفحص التلقائي
      const { data, error } = await supabase.functions.invoke('auto-check-analyses');
      
      if (error) {
        console.error('Error invoking auto-check function:', error);
        throw error;
      }
      
      console.log('Manual check completed:', data);
      
      // تحديث وقت آخر فحص في واجهة المستخدم
      if (data && data.timestamp) {
        setLastCheckTime(new Date(data.timestamp));
        
        // إطلاق حدث لتحديث واجهة المستخدم
        const event = new CustomEvent('historyUpdated', {
          detail: { timestamp: data.timestamp }
        });
        window.dispatchEvent(event);
        
        toast.success(`تم فحص ${data.checked || 'جميع'} التحليلات بنجاح`);
      } else {
        toast.info('لا توجد تحليلات نشطة للفحص');
      }
    } catch (error) {
      console.error('Error in manual check:', error);
      toast.error('حدث خطأ أثناء فحص التحليلات');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    triggerManualCheck,
    isLoading,
    lastCheckTime
  };
};
