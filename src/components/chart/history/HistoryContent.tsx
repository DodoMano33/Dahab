import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { AnalysisData } from "@/types/analysis";

interface HistoryContentProps {
  history: Array<{
    id: string;
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    targetHit?: boolean;
    stopLossHit?: boolean;
    analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns";
    timeframe: string;
  }>;
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onDelete
}: HistoryContentProps) => {
  return (
    <div className="relative rounded-md border bg-background">
      <div className="overflow-x-auto">
   <div className="overflow-y-auto">
        <Table>
          <HistoryTableHeader showCheckbox={true} />
          <TableBody>
            {history.map((item) => (
              <HistoryRow
                key={item.id}
                {...item}
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
