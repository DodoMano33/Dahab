
import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface UseHistoryRealtimeProps {
  onDataUpdate: () => void;
}

export const useHistoryRealtime = ({ onDataUpdate }: UseHistoryRealtimeProps) => {
  // Listen to history update events
  useEffect(() => {
    const handleHistoryUpdate = () => {
      console.log("History update event detected, refreshing data");
      onDataUpdate();
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, [onDataUpdate]);
  
  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up realtime subscription for search_history");
    
    const channel = supabase
      .channel('search_history_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'search_history'
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          onDataUpdate();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataUpdate]);
};
