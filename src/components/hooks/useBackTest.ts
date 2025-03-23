
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useBackTest = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  // إضافة المتغيرات المفقودة التي تم استخدامها في BacktestCheckButton
  const [retryCount, setRetryCount] = useState(0);
  const [diagnostics, setDiagnostics] = useState([]);

  const cancelCurrentRequest = useCallback(() => {
    console.log("Cancelling current request - this is a stub function");
    // يمكننا إضافة منطق فعلي هنا إذا لزم الأمر
  }, []);

  const triggerManualCheck = useCallback(async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
      return;
    }

    try {
      setIsLoading(true);
      
      // إظهار رسالة بدء الفحص
      toast.info("جاري فحص التحليلات...");
      
      const { data, error } = await supabase.functions.invoke('check-analysis-targets', {
        body: { forceCheck: true }
      });
      
      if (error) {
        console.error("خطأ في فحص التحليلات:", error);
        toast.error("حدث خطأ أثناء فحص التحليلات");
        setRetryCount(prev => prev + 1);
        return;
      }
      
      // تحديث وقت آخر فحص
      setLastCheckTime(new Date());
      
      // عرض نتيجة الفحص
      const { checked, updated } = data;
      
      if (updated > 0) {
        toast.success(`تم تحديث ${updated} تحليل من إجمالي ${checked} تم فحصها`);
      } else {
        toast.info(`تم فحص ${checked} تحليل، لا توجد تحديثات`);
      }
    } catch (error) {
      console.error("خطأ غير متوقع:", error);
      toast.error("حدث خطأ غير متوقع أثناء الفحص");
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    triggerManualCheck,
    isLoading,
    lastCheckTime,
    retryCount,
    cancelCurrentRequest,
    diagnostics
  };
};

// إضافة تصدير افتراضي
export default useBackTest;
