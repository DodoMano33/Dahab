
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

/**
 * هوك لجلب بيانات سجل البحث من قاعدة البيانات
 */
export function useFetchHistory() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const maxRetries = 3;

  const fetchSearchHistory = useCallback(async (): Promise<SearchHistoryItem[]> => {
    try {
      setIsRefreshing(true);
      console.log("جلب سجل البحث...");
      
      // محاولة مسح التخزين المؤقت قبل الاستعلام
      await clearSearchHistoryCache();
      
      // استخدام تحديد صريح للأعمدة لتجنب مشاكل التخزين المؤقت لمخطط البيانات
      const { data, error } = await supabase
        .from('search_history')
        .select(`
          id, 
          created_at, 
          symbol, 
          current_price, 
          analysis, 
          analysis_type, 
          timeframe, 
          target_hit, 
          stop_loss_hit, 
          analysis_duration_hours, 
          last_checked_at, 
          last_checked_price, 
          result_timestamp
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("خطأ في جلب سجل البحث:", error);
        
        // تحقق مما إذا كانت المشكلة تتعلق بالاتصال بالشبكة
        if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          toast.error("تعذر الاتصال بقاعدة البيانات، يرجى التحقق من اتصالك بالإنترنت");
          throw error;
        }
        
        // محاولة مسح التخزين المؤقت وإعادة المحاولة إذا كان الخطأ متعلقًا بمخطط البيانات
        if (error.message.includes('schema cache') || error.message.includes('analysis_duration_hours')) {
          console.log("محاولة إصلاح مشكلة التخزين المؤقت وإعادة المحاولة...");
          
          await clearSupabaseCache();
          
          // زيادة عداد المحاولات
          setRetryCount(prev => prev + 1);
          
          if (retryCount < maxRetries) {
            // انتظار لحظة ثم إعادة المحاولة
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchSearchHistory();
          } else {
            toast.error("فشل في استرداد البيانات بعد عدة محاولات. يرجى إعادة تحميل الصفحة.");
            throw new Error("فشل في استرداد البيانات بعد عدة محاولات");
          }
        }
        
        throw error;
      }

      console.log("تم استلام بيانات سجل البحث:", data);

      // إعادة تعيين عداد المحاولات بعد النجاح
      setRetryCount(0);

      const formattedHistory: SearchHistoryItem[] = data.map(item => ({
        id: item.id,
        date: new Date(item.created_at),
        symbol: item.symbol,
        currentPrice: item.current_price,
        analysis: item.analysis,
        analysisType: item.analysis_type,
        timeframe: item.timeframe || '1d',
        targetHit: item.target_hit || false,
        stopLossHit: item.stop_loss_hit || false,
        analysis_duration_hours: item.analysis_duration_hours || 8,
        last_checked_at: item.last_checked_at,
        last_checked_price: item.last_checked_price,
        result_timestamp: item.result_timestamp
      }));

      return formattedHistory;
    } catch (error) {
      console.error("خطأ في جلب سجل البحث:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
      return [];
    } finally {
      setIsRefreshing(false);
    }
  }, [retryCount, maxRetries]);

  return { 
    fetchSearchHistory, 
    isRefreshing, 
    setIsRefreshing
  };
}
