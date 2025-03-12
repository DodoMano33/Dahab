
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useBackTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  // جلب آخر وقت فحص عند تحميل المكون
  useEffect(() => {
    const fetchLastCheckTime = async () => {
      try {
        console.log("Fetching last check time...");
        const { data, error } = await supabase
          .from('search_history')
          .select('last_checked_at')
          .order('last_checked_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching last_checked_at:", error);
          return;
        }

        if (data && data.length > 0 && data[0].last_checked_at) {
          console.log("Initial last_checked_at:", data[0].last_checked_at);
          setLastCheckTime(new Date(data[0].last_checked_at));
        } else {
          console.log("No last_checked_at found in database");
        }
      } catch (err) {
        console.error("Exception in fetchLastCheckTime:", err);
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
    
    // الاستماع لحدث اكتمال فحص التحليلات
    const handleAnalysesChecked = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("useBackTest detected analyses checked with timestamp:", customEvent.detail.timestamp);
        setLastCheckTime(new Date(customEvent.detail.timestamp));
      }
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    window.addEventListener('analyses-checked', handleAnalysesChecked);
    
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
      window.removeEventListener('analyses-checked', handleAnalysesChecked);
    };
  }, []);

  const triggerManualCheck = async () => {
    try {
      console.log("Triggering manual check...");
      setIsLoading(true);
      
      // طلب السعر الحالي
      window.dispatchEvent(new Event('request-current-price'));
      
      // استدعاء حدث الفحص اليدوي
      window.dispatchEvent(new Event('manual-check-analyses'));
      
      // طلب فحص التحليلات من الخادم
      const { data, error } = await supabase.functions.invoke('auto-check-analyses');
      
      if (error) {
        console.error('Error invoking auto-check function:', error);
        toast.error(`فشل في فحص التحليلات: ${error.message}`);
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
