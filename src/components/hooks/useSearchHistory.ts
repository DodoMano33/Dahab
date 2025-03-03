
import { useState, useEffect } from "react";
import { SearchHistoryItem } from "@/types/analysis";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useSearchHistory = () => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastDeletedCount, setLastDeletedCount] = useState(0);

  // تطبيق استدعاء دوري للتحقق من التحليلات المنتهية
  useEffect(() => {
    if (user) {
      // استدعاء الفحص مرة عند التحميل
      fetchSearchHistory();
      
      // إعداد قناة الاستماع للتغييرات في الوقت الفعلي
      const channel = supabase
        .channel('search_history_changes')
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'search_history'
          },
          (payload) => {
            console.log('Realtime deletion detected:', payload);
            setSearchHistory(prev => prev.filter(item => item.id !== payload.old.id));
          }
        )
        .subscribe();
      
      // جدولة فحص وحذف التحليلات المنتهية كل دقيقة
      const checkExpiredInterval = setInterval(() => {
        console.log("Auto checking for expired analyses...");
        checkAndDeleteExpiredAnalyses(true);
      }, 60000); // كل دقيقة
      
      return () => {
        supabase.removeChannel(channel);
        clearInterval(checkExpiredInterval);
      };
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    try {
      console.log("Fetching search history...");
      const { data, error } = await supabase
        .from('search_history')
        .select('*, analysis_duration_hours')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching search history:", error);
        throw error;
      }

      console.log("Received search history data:", data);

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
        analysis_expiry_date: item.analysis_expiry_date
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
    }
  };

  const checkAndDeleteExpiredAnalyses = async (silent = false) => {
    if (!user) return;
    
    try {
      if (!silent) {
        console.log("Manually checking for expired analyses...");
      }
      
      // استدعاء وظيفة Edge Function لحذف التحليلات المنتهية
      const { data, error } = await supabase.functions.invoke('delete-expired-analyses', {
        method: 'POST'
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Response from delete-expired-analyses:', data);
      setLastDeletedCount(data?.deletedCount || 0);
      
      // تحديث قائمة سجل البحث
      await fetchSearchHistory();
      
      if (!silent && data?.deletedCount > 0) {
        toast.success(`تم حذف ${data.deletedCount} من التحليلات المنتهية`);
      } else if (!silent) {
        toast.info("لا توجد تحليلات منتهية للحذف");
      }
    } catch (error) {
      console.error('Error checking expired analyses:', error);
      if (!silent) {
        toast.error("حدث خطأ أثناء فحص التحليلات المنتهية");
      }
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      console.log("Attempting to delete history item:", id);
      
      const { data, error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error("Error deleting history item:", error);
        toast.error("حدث خطأ أثناء حذف العنصر");
        return;
      }

      // لا نحتاج لتحديث القائمة يدويًا لأن الـ realtime subscription سيقوم بذلك
      toast.success("تم حذف العنصر بنجاح");
      
      console.log("Successfully deleted history item:", id);
    } catch (error) {
      console.error("Error in handleDeleteHistoryItem:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  const refreshHistory = async () => {
    try {
      if (!user) return;
      
      setIsRefreshing(true);
      
      console.log("Refreshing history and checking expired analyses...");
      
      // استدعاء دالة فحص وحذف التحليلات المنتهية
      await checkAndDeleteExpiredAnalyses();
      
      if (lastDeletedCount > 0) {
        toast.success(`تم تحديث سجل البحث وحذف ${lastDeletedCount} من التحليلات المنتهية`);
      } else {
        toast.success("تم تحديث سجل البحث، لا توجد تحليلات منتهية");
      }
    } catch (error) {
      console.error("Error in refreshHistory:", error);
      toast.error("حدث خطأ أثناء تحديث سجل البحث");
    } finally {
      setIsRefreshing(false);
    }
  };

  const addToSearchHistory = (item: SearchHistoryItem) => {
    console.log("Adding new item to search history:", item);
    setSearchHistory(prev => [item, ...prev]);
  };

  return {
    searchHistory,
    isHistoryOpen,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory,
    refreshHistory,
    isRefreshing,
    checkAndDeleteExpiredAnalyses
  };
};
