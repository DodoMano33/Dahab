
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useTargetsCheck(fetchSearchHistory: () => Promise<void>) {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // فحص تحقق الأهداف ووقف الخسارة
  const checkTargetsAndStopLoss = async () => {
    try {
      console.log("فحص تحقق الأهداف ووقف الخسارة...");
      
      if (!user) {
        toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
        return;
      }
      
      setIsRefreshing(true);
      toast.info("جاري فحص تحقق الأهداف ووقف الخسارة...");
      
      // استدعاء وظيفة Edge Function لفحص التحليلات
      const { data, error } = await supabase.functions.invoke('check-analysis-targets', {
        body: { forceCheck: true } // إضافة خيار لفرض الفحص على جميع التحليلات
      });
      
      if (error) {
        console.error("خطأ في استدعاء وظيفة فحص التحليلات:", error);
        toast.error("حدث خطأ أثناء فحص تحقق الأهداف");
        setIsRefreshing(false);
        return;
      }
      
      console.log("نتيجة فحص التحليلات:", data);
      
      // تحديث القائمة بعد الفحص
      await fetchSearchHistory();
      
      // عرض نتائج الفحص
      const { checked, updated } = data;
      
      if (updated > 0) {
        toast.success(`تم تحديث ${updated} تحليل من إجمالي ${checked} تم فحصها`);
      } else {
        toast.info(`تم فحص ${checked} تحليل، لا توجد تحديثات`);
      }
      
      setIsRefreshing(false);
    } catch (error) {
      console.error("خطأ في فحص تحقق الأهداف ووقف الخسارة:", error);
      toast.error("حدث خطأ أثناء الفحص");
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    setIsRefreshing,
    checkTargetsAndStopLoss
  };
}
