
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { useState, useEffect, useCallback } from "react";
import { HistoryTable } from "./components/HistoryTable";
import { useHistoryRealtime } from "./hooks/useHistoryRealtime";
import { useHistoryDataRefresh } from "./hooks/useHistoryDataRefresh";

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
  
  // Local state for storing updated data
  const [localHistory, setLocalHistory] = useState(history);
  
  // Update local history when the prop changes
  useEffect(() => {
    console.log("History prop updated, updating local history");
    setLocalHistory(history);
  }, [history]);
  
  // Function to update history data from the database
  const { refreshHistoryData } = useHistoryDataRefresh();
  
  const updateHistoryData = useCallback(async () => {
    if (history.length === 0) return;
    
    const ids = history.map(item => item.id);
    const updatedData = await refreshHistoryData(ids);
    
    if (!updatedData) return;
    
    // Update local history with new values
    setLocalHistory(prev => {
      const updated = [...prev];
      updatedData.forEach(update => {
        const index = updated.findIndex(item => item.id === update.id);
        if (index !== -1) {
          // Update the item while preserving other data
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
  }, [history, refreshHistoryData]);
  
  // Set up real-time updates
  useHistoryRealtime({ onDataUpdate: updateHistoryData });

  return (
    <div className="relative w-full h-full">
      <ScrollArea className="h-full">
        <HistoryTable 
          historyItems={localHistory}
          selectedItems={selectedItems}
          onSelect={onSelect}
        />
      </ScrollArea>
    </div>
  );
};
