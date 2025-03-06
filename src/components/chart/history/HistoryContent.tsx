
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
  onDelete: (id: string) => void;
}

export const HistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onDelete,
}: HistoryContentProps) => {
  console.log("HistoryContent rendered with history items:", history.length);
  
  // استخدام حالة محلية لتخزين البيانات المحدثة
  const [localHistory, setLocalHistory] = useState(history);
  
  // تحديث البيانات المحلية عند تغير البيانات القادمة من المستوى الأعلى
  useEffect(() => {
    console.log("History prop updated, updating local history");
    setLocalHistory(history);
  }, [history]);
  
  // وظيفة تحديث البيانات من قاعدة البيانات
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
      
      // تحديث البيانات المحلية بالقيم الجديدة
      setLocalHistory(prev => {
        const updated = [...prev];
        data.forEach(update => {
          const index = updated.findIndex(item => item.id === update.id);
          if (index !== -1) {
            // تحديث البيانات مع الحفاظ على البيانات الأخرى
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
  
  // الاستماع إلى حدث تحديث البيانات
  useEffect(() => {
    const handleHistoryUpdate = () => {
      console.log("History update event detected, refreshing data");
      refreshHistoryData();
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, [refreshHistoryData]);
  
  // استماع إلى التغييرات في الوقت الحقيقي من قاعدة البيانات
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
          
          // تحديث البيانات المحلية
          setLocalHistory(prev => {
            const updated = [...prev];
            const index = updated.findIndex(item => item.id === payload.new.id);
            
            if (index !== -1) {
              // تحديث العنصر بالبيانات الجديدة
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

  return (
    <div className="relative w-full h-full">
      <ScrollArea className="h-full">
        <Table className="w-full table-fixed">
          <HistoryTableHeader showCheckbox={true} />
          <TableBody>
            {localHistory.map((item) => (
              <HistoryRow
                key={item.id}
                {...item}
                analysis_duration_hours={item.analysis_duration_hours}
                last_checked_price={item.last_checked_price}
                last_checked_at={item.last_checked_at}
                isSelected={selectedItems.has(item.id)}
                onSelect={() => onSelect(item.id)}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
