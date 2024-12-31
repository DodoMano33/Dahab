import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SearchHistoryItem } from '../types/searchHistory';
import { User } from '@supabase/supabase-js';

export const useSearchHistory = (user: User | null) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const fetchSearchHistory = async () => {
    try {
      console.log("Fetching search history...");
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Received search history data:", data);

      const formattedHistory: SearchHistoryItem[] = data.map(item => ({
        id: item.id,
        date: new Date(item.created_at),
        symbol: item.symbol,
        currentPrice: item.current_price,
        analysis: item.analysis,
        analysisType: item.analysis_type
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
    }
  };

  const deleteHistoryItem = async (id: string) => {
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

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  return {
    searchHistory,
    setSearchHistory,
    deleteHistoryItem,
    fetchSearchHistory
  };
};