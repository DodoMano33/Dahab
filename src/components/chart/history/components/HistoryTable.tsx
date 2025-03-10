
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "../HistoryTableHeader";
import { HistoryRow } from "../HistoryRow";
import { AnalysisType } from "@/types/analysis";

interface HistoryTableProps {
  history: Array<{
    id: string;
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: any;
    analysisType: AnalysisType;
    timeframe: string;
    analysis_duration_hours?: number;
    last_checked_price?: number;
    last_checked_at?: Date | string | null;
  }>;
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  isAllSelected: boolean;
  onSelectAll: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  history,
  selectedItems,
  onSelect,
  isAllSelected,
  onSelectAll
}) => {
  return (
    <Table className="w-full table-fixed">
      <HistoryTableHeader 
        showCheckbox={true} 
        isAllSelected={isAllSelected}
        onSelectAll={onSelectAll}
      />
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
  );
};
