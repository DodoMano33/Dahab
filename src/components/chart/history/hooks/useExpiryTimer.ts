
import { useState, useEffect, useRef } from "react";
import { addHours, differenceInMinutes, differenceInHours, differenceInSeconds } from "date-fns";
import { supabase } from "@/lib/supabase";

interface UseExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
}

export const useExpiryTimer = ({ createdAt, analysisId, durationHours = 8 }: UseExpiryTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);
  // معرف للمؤقت
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // معرف لرمز الحذف (لتجنب الحذف المتكرر)
  const deleteAttemptedRef = useRef<boolean>(false);

  useEffect(() => {
    // إضافة ساعات إلى تاريخ الإنشاء لحساب تاريخ الانتهاء
    const expiryDate = addHours(new Date(createdAt), durationHours);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();
      
      // إذا كان الوقت قد انتهى
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("منتهي");
        
        // عندما ينتهي التحليل، نقوم بحذفه تلقائيًا (مرة واحدة فقط)
        if (analysisId && !deleteAttemptedRef.current) {
          deleteAttemptedRef.current = true;
          console.log(`التحليل ${analysisId} منتهي، جاري الحذف...`);
          supabase
            .from('search_history')
            .delete()
            .eq('id', analysisId)
            .then(({ error }) => {
              if (error) {
                console.error("خطأ في حذف التحليل المنتهي:", error);
              } else {
                console.log(`تم حذف التحليل المنتهي ${analysisId} بنجاح`);
              }
            });
        }
        
        // توقف المؤقت بعد انتهاء الوقت
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        return;
      }
      
      const hours = differenceInHours(expiryDate, now);
      const minutes = differenceInMinutes(expiryDate, now) % 60;
      const seconds = differenceInSeconds(expiryDate, now) % 60;
      
      setTimeLeft(`${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };
    
    // تحديث الوقت المتبقي كل ثانية، لكن تبطئ التحديث إذا كان الوقت المتبقي طويلاً
    calculateTimeLeft();
    
    // استخدام فترات تحديث متغيرة حسب الوقت المتبقي للتحليل
    const updateInterval = expiryDate.getTime() - Date.now() > 3600000 ? 60000 : 1000; // ساعة أو أكثر: تحديث كل دقيقة، أقل من ساعة: تحديث كل ثانية
    
    timerRef.current = setInterval(calculateTimeLeft, updateInterval);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [createdAt, durationHours, analysisId]);
  
  return { timeLeft, isExpired };
};
