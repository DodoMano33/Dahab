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
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    try {
      console.log("Fetching search history...");
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching search history:", error);
        throw error;
      }

      console.log("Received search history data:", data);

      const formattedHistory: SearchHistoryItem[] = (data || []).map(item => ({
        id: item.id,
        date: new Date(item.created_at),
        symbol: item.symbol,
        currentPrice: item.current_price,
        analysis: item.analysis,
        analysisType: item.analysis_type,
        timeframe: item.timeframe || '1d',
        targetHit: item.target_hit || false,
        stopLossHit: item.stop_loss_hit || false
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSearchHistory(prev => prev.filter(item => item.id !== id));
      toast.success("تم حذف العنصر بنجاح");
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  const addToSearchHistory = async (item: SearchHistoryItem) => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .insert({
          user_id: user?.id,
          symbol: item.symbol,
          current_price: item.currentPrice,
          analysis: item.analysis,
          analysis_type: item.analysisType,
          timeframe: item.timeframe
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error("Error adding to search history:", error);
        throw error;
      }

      if (data) {
        const newItem: SearchHistoryItem = {
          id: data.id,
          date: new Date(data.created_at),
          symbol: data.symbol,
          currentPrice: data.current_price,
          analysis: data.analysis,
          analysisType: data.analysis_type,
          timeframe: data.timeframe || '1d',
          targetHit: false,
          stopLossHit: false
        };
        setSearchHistory(prev => [newItem, ...prev]);
      }
    } catch (error) {
      console.error("Error adding to search history:", error);
      toast.error("حدث خطأ أثناء إضافة العنصر إلى سجل البحث");
    }
  };

  return {
    searchHistory,
    isHistoryOpen,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory
  };
};