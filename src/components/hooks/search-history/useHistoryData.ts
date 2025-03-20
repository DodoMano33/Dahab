
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

export function useHistoryData() {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // فحص البيانات عند تحميل المكون أو تغير المستخدم
  useEffect(() => {
    if (user) {
      // مسح ذاكرة التخزين المؤقت لمخطط البيانات قبل جلب البيانات
      const initFetch = async () => {
        // محاولة مسح التخزين المؤقت لمخطط قاعدة البيانات 
        await clearSupabaseCache();
        await clearSearchHistoryCache();
        // ثم جلب البيانات
        fetchSearchHistory();
      };
      
      initFetch();
      
      // إعداد قناة الاستماع للتغييرات في الوقت الفعلي
      const channel = supabase
        .channel('search_history_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'search_history'
          },
          (payload) => {
            console.log('Realtime change detected:', payload);
            if (payload.eventType === 'DELETE') {
              setSearchHistory(prev => prev.filter(item => item.id !== payload.old.id));
            } else if (payload.eventType === 'INSERT') {
              fetchSearchHistory();
            } else if (payload.eventType === 'UPDATE') {
              fetchSearchHistory();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
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
        
        // محاولة مسح التخزين المؤقت وإعادة المحاولة إذا كان الخطأ متعلقًا بمخطط البيانات
        if (error.message.includes('schema cache') || error.message.includes('analysis_duration_hours')) {
          console.log("محاولة إصلاح مشكلة التخزين المؤقت وإعادة المحاولة...");
          
          await clearSupabaseCache();
          
          // انتظار لحظة ثم إعادة المحاولة
          setTimeout(() => fetchSearchHistory(), 500);
          return;
        }
        
        throw error;
      }

      console.log("تم استلام بيانات سجل البحث:", data);

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

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("خطأ في جلب سجل البحث:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      console.log("محاولة حذف عنصر من السجل:", id);
      
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("خطأ في حذف العنصر:", error);
        toast.error("حدث خطأ أثناء حذف العنصر");
        return;
      }

      // تحديث القائمة المحلية
      setSearchHistory(prev => prev.filter(item => item.id !== id));
      toast.success("تم حذف العنصر بنجاح");
      
      console.log("تم حذف العنصر بنجاح:", id);
    } catch (error) {
      console.error("خطأ في handleDeleteHistoryItem:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  const addToSearchHistory = (item: SearchHistoryItem) => {
    console.log("إضافة عنصر جديد إلى سجل البحث:", item);
    setSearchHistory(prev => [item, ...prev]);
  };

  return {
    searchHistory,
    setSearchHistory,
    isRefreshing,
    setIsRefreshing,
    fetchSearchHistory,
    handleDeleteHistoryItem,
    addToSearchHistory
  };
}
