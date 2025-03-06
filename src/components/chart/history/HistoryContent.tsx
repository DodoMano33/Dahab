
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { useEffect, useState } from "react";

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
  console.log("HistoryContent history:", history);
  
  // إضافة مكوّن القوة للاستماع لتحديثات البيانات
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    // إنشاء مستمع للتحديثات من البيانات
    const handleHistoryUpdate = () => {
      console.log("History update detected, refreshing UI");
      forceUpdate({});
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <ScrollArea className="h-full">
        <Table className="w-full table-fixed">
          <HistoryTableHeader showCheckbox={true} />
          <TableBody>
            {history.map((item) => (
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
