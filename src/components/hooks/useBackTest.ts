
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface BackTestConfig {
  interval: number; // الفاصل الزمني بالدقائق
  isAutoCheckEnabled: boolean;
}

export const useBackTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [autoCheckConfig, setAutoCheckConfig] = useState<BackTestConfig>({
    interval: 30, // افتراضياً 30 دقيقة
    isAutoCheckEnabled: false
  });
  const { user } = useAuth();
  
  // استرجاع الإعدادات من التخزين المحلي
  useEffect(() => {
    const savedConfig = localStorage.getItem('backTestConfig');
    if (savedConfig) {
      try {
        setAutoCheckConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("خطأ في قراءة إعدادات الفحص التلقائي:", e);
      }
    }
  }, []);
  
  // حفظ الإعدادات عند تغييرها
  useEffect(() => {
    localStorage.setItem('backTestConfig', JSON.stringify(autoCheckConfig));
  }, [autoCheckConfig]);
  
  // إعداد الفحص التلقائي الدوري
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (user && autoCheckConfig.isAutoCheckEnabled) {
      intervalId = setInterval(() => {
        console.log(`تنفيذ الفحص التلقائي كل ${autoCheckConfig.interval} دقيقة`);
        triggerManualCheck(true); // silent mode
      }, autoCheckConfig.interval * 60 * 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, autoCheckConfig.isAutoCheckEnabled, autoCheckConfig.interval]);

  const triggerManualCheck = useCallback(async (isSilent = false) => {
    if (!user) {
      if (!isSilent) toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
      return;
    }

    setIsLoading(true);
    try {
      if (!isSilent) toast.info("جاري فحص حالة التحليلات...");
      
      // فحص حالة السوق أولاً
      const marketStatusResponse = await supabase.functions.invoke('check-market-status');
      
      if (!marketStatusResponse.data?.isOpen) {
        if (!isSilent) toast.warning("السوق مغلق حالياً. بعض التحليلات قد لا تتحدث بشكل صحيح.");
      }
      
      // ثم فحص أهداف التحليل
      const { data, error } = await supabase.functions.invoke('check-analysis-targets', {
        body: { forceCheck: true }
      });

      if (error) {
        console.error("خطأ أثناء فحص التحليلات:", error);
        if (!isSilent) toast.error("حدث خطأ أثناء فحص التحليلات");
        return;
      }

      const { checked, updated } = data;
      setLastCheckTime(new Date());

      if (!isSilent) {
        if (updated > 0) {
          toast.success(`تم تحديث ${updated} تحليل من إجمالي ${checked} تم فحصها`);
        } else if (checked > 0) {
          toast.info(`تم فحص ${checked} تحليل، لا توجد تغييرات`);
        } else {
          toast.info("لا توجد تحليلات نشطة للفحص");
        }
      }
    } catch (error) {
      console.error("خطأ أثناء فحص التحليلات:", error);
      if (!isSilent) toast.error("حدث خطأ أثناء فحص التحليلات");
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  const updateAutoCheckConfig = useCallback((config: Partial<BackTestConfig>) => {
    setAutoCheckConfig(prev => ({ ...prev, ...config }));
  }, []);
  
  const toggleAutoCheck = useCallback(() => {
    setAutoCheckConfig(prev => ({ 
      ...prev, 
      isAutoCheckEnabled: !prev.isAutoCheckEnabled 
    }));
  }, []);

  return {
    triggerManualCheck,
    isLoading,
    lastCheckTime,
    autoCheckConfig,
    updateAutoCheckConfig,
    toggleAutoCheck
  };
};
