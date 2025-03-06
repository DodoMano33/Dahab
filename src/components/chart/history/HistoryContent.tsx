
import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { AnalysisData, AnalysisType } from "@/types/analysis";

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
    last_checked_at?: Date;
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

  return (
    <div className="relative rounded-md border bg-background h-full">
      <div className="overflow-x-auto h-full overflow-y-auto">
        <Table className="relative w-full table-fixed">
          <HistoryTableHeader showCheckbox={true} />
          <TableBody className="relative">
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
      </div>
    </div>
  );
};
