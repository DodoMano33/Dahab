import { useState, useEffect } from "react";
import { SearchHistoryItem } from "@/types/analysis";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useSearchHistory = () => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (user) {
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

      return () => {
        supabase.removeChannel(channel);
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
        analysis_duration_hours: item.analysis_duration_hours || 8
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
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

  const addToSearchHistory = (item: SearchHistoryItem) => {
    console.log("Adding new item to search history:", item);
    setSearchHistory(prev => [item, ...prev]);
  };

  return {
    searchHistory,
    isHistoryOpen,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory
  };
};