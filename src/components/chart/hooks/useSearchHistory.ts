import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SearchHistoryItem } from '../types/searchHistory';
import { User } from '@supabase/supabase-js';

export const useSearchHistory = (user: User | null) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching search history for user:", user?.id);

      const { data, error: fetchError } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error("Error fetching search history:", fetchError);
        setError(fetchError.message);
        toast.error("حدث خطأ أثناء جلب سجل البحث");
        return;
      }

      console.log("Received search history data:", data);

      if (!data) {
        console.log("No search history data found");
        setSearchHistory([]);
        return;
      }

      const formattedHistory: SearchHistoryItem[] = data.map(item => ({
        id: item.id,
        date: new Date(item.created_at),
        symbol: item.symbol,
        currentPrice: item.current_price,
        analysis: item.analysis,
        analysisType: item.analysis_type,
        targetHit: item.target_hit || false,
        stopLossHit: item.stop_loss_hit || false
      }));

      console.log("Formatted search history:", formattedHistory);
      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error("Unexpected error fetching search history:", error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error("حدث خطأ غير متوقع أثناء جلب سجل البحث");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      console.log("Deleting history item:", id);
      const { error: deleteError } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (deleteError) {
        console.error("Error deleting history item:", deleteError);
        toast.error("حدث خطأ أثناء حذف العنصر");
        return;
      }

      setSearchHistory(prev => prev.filter(item => item.id !== id));
      toast.success("تم حذف العنصر بنجاح");
    } catch (error) {
      console.error("Unexpected error deleting history item:", error);
      toast.error("حدث خطأ غير متوقع أثناء حذف العنصر");
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User authenticated, fetching search history");
      fetchSearchHistory();
    } else {
      console.log("No user authenticated, clearing search history");
      setSearchHistory([]);
    }
  }, [user]);

  return {
    searchHistory,
    setSearchHistory,
    deleteHistoryItem,
    fetchSearchHistory,
    isLoading,
    error
  };
};