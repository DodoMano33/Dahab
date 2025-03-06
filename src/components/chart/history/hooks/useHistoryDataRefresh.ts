
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export const useHistoryDataRefresh = () => {
  const refreshHistoryData = useCallback(async (historyIds: string[]) => {
    try {
      console.log("Manually refreshing history data for displayed items");
      
      if (historyIds.length === 0) return null;
      
      const { data, error } = await supabase
        .from('search_history')
        .select('id, last_checked_at, last_checked_price')
        .in('id', historyIds);
        
      if (error) {
        console.error("Error fetching updated history data:", error);
        return null;
      }
      
      if (!data || data.length === 0) {
        console.log("No updated data received");
        return null;
      }
      
      console.log("Received updated history data:", data);
      return data;
      
    } catch (error) {
      console.error("Error in refreshHistoryData:", error);
      return null;
    }
  }, []);

  return { refreshHistoryData };
};
