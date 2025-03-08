
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryTable } from "./components/HistoryTable";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { useEffect, useState, useCallback } from "react";
import { useRealtimeUpdates } from "./hooks/useRealtimeUpdates";
import { useHistoryRefresh } from "./hooks/useHistoryRefresh";

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
  onSelectAll?: (select: boolean) => void;
}

export const HistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onDelete,
  onSelectAll,
}: HistoryContentProps) => {
  console.log("HistoryContent rendered with history items:", history.length);
  
  // استخدام حالة محلية لتخزين البيانات المحدثة
  const [localHistory, setLocalHistory] = useState(history);
  
  // تحديث البيانات المحلية عند تغير البيانات القادمة من المستوى الأعلى
  useEffect(() => {
    console.log("History prop updated, updating local history");
    setLocalHistory(history);
  }, [history]);
  
  // التحقق مما إذا كانت جميع العناصر محددة
  const isAllSelected = history.length > 0 && selectedItems.size === history.length;
  
  // وظيفة لتحديد أو إلغاء تحديد جميع العناصر
  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(!isAllSelected);
    }
  };
  
  // معالج تحديث البيانات
  const handleDataRefresh = useCallback((updatedData: any[]) => {
    setLocalHistory(prev => {
      const updated = [...prev];
      updatedData.forEach(update => {
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
  }, []);
  
  // معالج تحديثات الوقت الحقيقي
  const handleRealtimeUpdate = useCallback((newData: any) => {
    setLocalHistory(prev => {
      const updated = [...prev];
      const index = updated.findIndex(item => item.id === newData.id);
      
      if (index !== -1) {
        // تحديث العنصر بالبيانات الجديدة
        updated[index] = {
          ...updated[index],
          last_checked_at: newData.last_checked_at,
          last_checked_price: newData.last_checked_price
        };
        console.log(`Updated item ${newData.id} via realtime:`, newData);
      }
      
      return updated;
    });
  }, []);
  
  // استخدام الهوك المخصص لتحديثات الوقت الحقيقي
  useRealtimeUpdates({ onDataUpdate: handleRealtimeUpdate });
  
  // استخدام الهوك المخصص لتحديث البيانات
  useHistoryRefresh({ 
    history: localHistory, 
    onDataRefresh: handleDataRefresh 
  });

  return (
    <div className="relative w-full h-full">
      <ScrollArea className="h-full">
        <HistoryTable 
          history={localHistory}
          selectedItems={selectedItems}
          onSelect={onSelect}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
        />
      </ScrollArea>
    </div>
  );
};
