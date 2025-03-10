
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";

interface UseRealtimeUpdatesProps {
  onDataUpdate: (updatedData: any) => void;
}

export const useRealtimeUpdates = ({ onDataUpdate }: UseRealtimeUpdatesProps) => {
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
          onDataUpdate(payload.new);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataUpdate]);
};
