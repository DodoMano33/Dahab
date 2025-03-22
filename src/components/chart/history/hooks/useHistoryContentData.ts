
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";

export function useHistoryContentData(history: SearchHistoryItem[]) {
  const [localHistory, setLocalHistory] = useState<SearchHistoryItem[]>(history);
  
  useEffect(() => {
    console.log("History prop updated, updating local history");
    setLocalHistory(history);
  }, [history]);
  
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
      
      setLocalHistory(prev => {
        const updated = [...prev];
        data.forEach(update => {
          const index = updated.findIndex(item => item.id === update.id);
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              last_checked_at: update.last_checked_at,
              last_checked_price: update.last_checked_price
            };
            console.log(`Updated item ${update.id} with new data:`, update);
          }
        });
        return updated;
      });
    } catch (error) {
      console.error("Error in refreshHistoryData:", error);
    }
  }, [history]);

  // Set up realtime subscription
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
          
          setLocalHistory(prev => {
            const updated = [...prev];
            const index = updated.findIndex(item => item.id === payload.new.id);
            
            if (index !== -1) {
              updated[index] = {
                ...updated[index],
                last_checked_at: payload.new.last_checked_at,
                last_checked_price: payload.new.last_checked_price
              };
              console.log(`Updated item ${payload.new.id} via realtime:`, payload.new);
            }
            
            return updated;
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Set up event listener for history updates
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

  // Initial data refresh and periodic updates
  useEffect(() => {
    console.log("Initial data refresh");
    refreshHistoryData();
    const interval = setInterval(refreshHistoryData, 30000);
    return () => clearInterval(interval);
  }, [refreshHistoryData]);

  return { localHistory, refreshHistoryData };
}
