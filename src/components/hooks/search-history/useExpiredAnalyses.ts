
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext";

export function useExpiredAnalyses(searchHistory: SearchHistoryItem[], updateHistory: (newHistory: SearchHistoryItem[]) => void) {
  const user = null; // التطبيق يعمل بدون مصادقة

  // تحقق من التحليلات المنتهية بشكل دوري
  useEffect(() => {
    if (user) {
      // فحص التحليلات المنتهية كل دقيقة
      const checkExpiredInterval = setInterval(() => {
        checkAndDeleteExpiredAnalyses();
      }, 60000); // كل دقيقة
      
      return () => clearInterval(checkExpiredInterval);
    }
  }, [user, searchHistory]);

  const checkAndDeleteExpiredAnalyses = async () => {
    try {
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
        const deletePromises = expiredItems.map(item => 
          supabase.from('search_history').delete().eq('id', item.id)
        );
        
        await Promise.all(deletePromises);
        
        // تحديث القائمة المحلية
        updateHistory(searchHistory.filter(item => !expiredItems.some(expired => expired.id === item.id)));
        
        console.log(`تم حذف ${expiredItems.length} تحليل منتهي بنجاح`);
        
        if (expiredItems.length > 0) {
          toast.info(`تم حذف ${expiredItems.length} تحليل منتهي`, { duration: 1000 });
        }
      }
    } catch (error) {
      console.error("خطأ في فحص وحذف التحليلات المنتهية:", error);
    }
  };

  return { checkAndDeleteExpiredAnalyses };
}
