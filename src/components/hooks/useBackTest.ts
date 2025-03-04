
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useBackTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const { user } = useAuth();

  const triggerManualCheck = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
      return;
    }

    setIsLoading(true);
    try {
      toast.info("جاري فحص حالة التحليلات...");
      
      // Check market status first
      const marketStatusResponse = await supabase.functions.invoke('check-market-status');
      
      if (!marketStatusResponse.data?.isOpen) {
        toast.warning("السوق مغلق حالياً. بعض التحليلات قد لا تتحدث بشكل صحيح.");
      }
      
      // Then check analysis targets
      const { data, error } = await supabase.functions.invoke('check-analysis-targets', {
        body: { forceCheck: true }
      });

      if (error) {
        console.error("خطأ أثناء فحص التحليلات:", error);
        toast.error("حدث خطأ أثناء فحص التحليلات");
        return;
      }

      const { checked, updated } = data;
      setLastCheckTime(new Date());

      if (updated > 0) {
        toast.success(`تم تحديث ${updated} تحليل من إجمالي ${checked} تم فحصها`);
      } else if (checked > 0) {
        toast.info(`تم فحص ${checked} تحليل، لا توجد تغييرات`);
      } else {
        toast.info("لا توجد تحليلات نشطة للفحص");
      }
    } catch (error) {
      console.error("خطأ أثناء فحص التحليلات:", error);
      toast.error("حدث خطأ أثناء فحص التحليلات");
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
