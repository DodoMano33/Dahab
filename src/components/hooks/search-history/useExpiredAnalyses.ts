
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useExpiredAnalyses(searchHistory: SearchHistoryItem[], updateHistory: (newHistory: SearchHistoryItem[]) => void) {
  const { user } = useAuth();
  // معرف للفحص الدوري
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // آخر وقت تم فيه الفحص
  const lastCheckRef = useRef<number>(0);

  // تحقق من التحليلات المنتهية بشكل دوري
  useEffect(() => {
    if (user) {
      // فحص التحليلات المنتهية كل 5 دقائق بدلاً من كل دقيقة
      checkIntervalRef.current = setInterval(() => {
        // تجنب الفحص المتكرر إذا تم فحص التحليلات خلال آخر 3 دقائق
        const now = Date.now();
        if (now - lastCheckRef.current > 180000) { // 3 دقائق
          checkAndDeleteExpiredAnalyses();
          lastCheckRef.current = now;
        }
      }, 300000); // كل 5 دقائق
      
      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      };
    }
  }, [user]);

  const checkAndDeleteExpiredAnalyses = async () => {
    try {
      if (!searchHistory.length) {
        return; // لا توجد تحليلات للفحص
      }
      
      console.log("فحص التحليلات المنتهية...");
      
      // تحويل التاريخ الحالي إلى كائن Date
      const now = new Date();
      
      // تحقق من كل تحليل في القائمة
      const expiredItems = searchHistory.filter(item => {
        const expiryDate = new Date(item.date);
        expiryDate.setHours(expiryDate.getHours() + (item.analysis_duration_hours || 8));
        return now > expiryDate;
      });
      
      if (expiredItems.length > 0) {
        console.log(`وجدنا ${expiredItems.length} تحليل منتهي، جاري الحذف...`);
        
        // حذف التحليلات المنتهية من قاعدة البيانات
        // استخدام عملية حذف واحدة بدلاً من عدة عمليات
        const expiredIds = expiredItems.map(item => item.id);
        
        const { error } = await supabase
          .from('search_history')
          .delete()
          .in('id', expiredIds);
        
        if (error) {
          console.error("خطأ في حذف التحليلات المنتهية:", error);
          return;
        }
        
        // تحديث القائمة المحلية
        updateHistory(searchHistory.filter(item => !expiredIds.includes(item.id)));
        
        console.log(`تم حذف ${expiredItems.length} تحليل منتهي بنجاح`);
        
        if (expiredItems.length > 0) {
          toast.info(`تم حذف ${expiredItems.length} تحليل منتهي`);
        }
      }
    } catch (error) {
      console.error("خطأ في فحص وحذف التحليلات المنتهية:", error);
    }
  };

  return { checkAndDeleteExpiredAnalyses };
}
