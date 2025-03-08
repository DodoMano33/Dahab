
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useHistoryData() {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // فحص البيانات عند تحميل المكون أو تغير المستخدم
  useEffect(() => {
    if (user) {
      fetchSearchHistory();
      
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
      const { data, error } = await supabase
        .from('search_history')
        .select('*, analysis_duration_hours')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("خطأ في جلب سجل البحث:", error);
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
        analysis_duration_hours: item.analysis_duration_hours || 8
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("خطأ في جلب سجل البحث:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث", {
        duration: 3000, // تعديل مدة التنبيه
      });
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
        toast.error("حدث خطأ أثناء حذف العنصر", {
          duration: 3000, // تعديل مدة التنبيه
        });
        return;
      }

      // تحديث القائمة المحلية
      setSearchHistory(prev => prev.filter(item => item.id !== id));
      toast.success("تم حذف العنصر بنجاح", {
        duration: 3000, // تعديل مدة التنبيه
      });
      
      console.log("تم حذف العنصر بنجاح:", id);
    } catch (error) {
      console.error("خطأ في handleDeleteHistoryItem:", error);
      toast.error("حدث خطأ أثناء حذف العنصر", {
        duration: 3000, // تعديل مدة التنبيه
      });
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
