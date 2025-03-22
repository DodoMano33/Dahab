
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface HistoryContentProps {
  history: Array<{
    id: string;
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    targetHit?: boolean;
    stopLossHit?: boolean;
    analysisType: AnalysisType;
    timeframe: string;
    analysis_duration_hours?: number;
    last_checked_price?: number;
    last_checked_at?: Date | string | null;
  }>;
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onSelectAll?: (checked: boolean) => void; // Add this to fix type error
}

export const HistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onDelete,
  onSelectAll, // Include this prop
}: HistoryContentProps) => {
  console.log("HistoryContent rendered with history items:", history.length);
  console.log("Sample first history item last_checked_at:", 
    history.length > 0 ? 
    `${history[0].id}: ${history[0].last_checked_at} (${typeof history[0].last_checked_at})` : 
    "No history items");
  
  const [localHistory, setLocalHistory] = useState(history);
  
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

  useEffect(() => {
    console.log("Initial data refresh");
    refreshHistoryData();
    const interval = setInterval(refreshHistoryData, 30000);
    return () => clearInterval(interval);
  }, [refreshHistoryData]);

  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    } else {
      if (checked) {
        const allIds = localHistory.map(item => item.id);
        allIds.forEach(id => onSelect(id));
      } else {
        localHistory.forEach(item => {
          if (selectedItems.has(item.id)) {
            onSelect(item.id);
          }
        });
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-white dark:bg-gray-950 rounded-md shadow-sm border border-slate-200 dark:border-slate-800">
      <ScrollArea className="h-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-max">
            <HistoryTableHeader 
              showCheckbox={true} 
              onSelectAll={handleSelectAll}
              isAllSelected={localHistory.length > 0 && selectedItems.size === localHistory.length}
            />
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {localHistory.length > 0 ? (
                localHistory.map((item) => (
                  <HistoryRow
                    key={item.id}
                    {...item}
                    analysis_duration_hours={item.analysis_duration_hours}
                    last_checked_price={item.last_checked_price}
                    last_checked_at={item.last_checked_at}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={() => onSelect(item.id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={13} className="text-center py-8 text-muted-foreground">
                    لا توجد بيانات في سجل البحث
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
