
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext";

export function useTargetsCheck(refreshCallback: () => Promise<void>) {
  const [isChecking, setIsChecking] = useState(false);
  const user = null; // التطبيق يعمل بدون مصادقة

  // فحص تحقق الأهداف ووقف الخسارة
  const checkTargetsAndStopLoss = async () => {
    try {
      console.log("فحص تحقق الأهداف ووقف الخسارة...");
      
      if (!user) {
        toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة", { duration: 1000 });
        return;
      }
      
      setIsChecking(true);
      toast.info("جاري فحص تحقق الأهداف ووقف الخسارة...", { duration: 1000 });
      
      // استدعاء وظيفة Edge Function لفحص التحليلات
      const { data, error } = await supabase.functions.invoke('check-analysis-targets', {
        body: { forceCheck: true } // إضافة خيار لفرض الفحص على جميع التحليلات
      });
      
      if (error) {
        console.error("خطأ في استدعاء وظيفة فحص التحليلات:", error);
        toast.error("حدث خطأ أثناء فحص تحقق الأهداف", { duration: 1000 });
        setIsChecking(false);
        return;
      }
      
      console.log("نتيجة فحص التحليلات:", data);
      
      // تحديث القائمة بعد الفحص
      await refreshCallback();
      
      // عرض نتائج الفحص
      const { checked, updated } = data;
      
      if (updated > 0) {
        toast.success(`تم تحديث ${updated} تحليل من إجمالي ${checked} تم فحصها`, { duration: 1000 });
      } else {
        toast.info(`تم فحص ${checked} تحليل، لا توجد تحديثات`, { duration: 1000 });
      }
      
      setIsChecking(false);
    } catch (error) {
      console.error("خطأ في فحص تحقق الأهداف ووقف الخسارة:", error);
      toast.error("حدث خطأ أثناء الفحص", { duration: 1000 });
      setIsChecking(false);
    }
  };

  return { 
    checkTargetsAndStopLoss, 
    isChecking 
  };
}
