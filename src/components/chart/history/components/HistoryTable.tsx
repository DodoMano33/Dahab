
import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "../HistoryTableHeader";
import { HistoryRow } from "../HistoryRow";
import { AnalysisData, AnalysisType } from "@/types/analysis";

interface HistoryTableProps {
  historyItems: Array<{
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
}

export const HistoryTable = ({
  historyItems,
  selectedItems,
  onSelect,
}: HistoryTableProps) => {
  return (
    <Table className="w-full table-fixed">
      <HistoryTableHeader showCheckbox={true} />
      <TableBody>
        {historyItems.map((item) => (
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
