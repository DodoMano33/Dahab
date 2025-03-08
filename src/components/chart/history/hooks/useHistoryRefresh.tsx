
import { useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UseHistoryRefreshProps {
  history: Array<{
    id: string;
    [key: string]: any;
  }>;
  onDataRefresh: (updatedData: any[]) => void;
}

export const useHistoryRefresh = ({ history, onDataRefresh }: UseHistoryRefreshProps) => {
  const refreshHistoryData = useCallback(async () => {
    try {
      console.log("Manually refreshing history data for displayed items");
      
      if (history.length === 0) return;
      
      const ids = history.map(item => item.id);
      
      const { data, error } = await supabase
        .from('search_history')
        .select('id, last_checked_at, last_checked_price')
        .in('id', ids);
        
      if (error) {
        console.error("Error fetching updated history data:", error);
        return;
      }
      
      if (!data || data.length === 0) {
        console.log("No updated data received");
        return;
      }
      
      console.log("Received updated history data:", data);
      onDataRefresh(data);
    } catch (error) {
      console.error("Error in refreshHistoryData:", error);
    }
  }, [history, onDataRefresh]);
  
  // الاستماع إلى حدث تحديث البيانات
  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("History update event detected with timestamp:", customEvent.detail.timestamp);
      } else {
        console.log("History update event detected, refreshing data");
      }
      refreshHistoryData();
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, [refreshHistoryData]);
  
  // تنفيذ تحديث للبيانات فوراً عند التحميل
  useEffect(() => {
    console.log("Initial data refresh");
    refreshHistoryData();
    // استدعاء التحديث كل 30 ثانية
    const interval = setInterval(refreshHistoryData, 30000);
    return () => clearInterval(interval);
  }, [refreshHistoryData]);
  
  return { refreshHistoryData };
};
