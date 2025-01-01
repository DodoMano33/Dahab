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
    analysisType: string;
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
    <div className="max-h-[70vh] overflow-auto">
      <Table>
        <HistoryTableHeader showCheckbox={true} showDelete={true} />
        <TableBody>
          {history.map((item) => (
            <HistoryRow
              key={item.id}
              id={item.id}
              date={item.date}
              symbol={item.symbol}
              currentPrice={item.currentPrice}
              analysis={item.analysis}
              analysisType={item.analysisType}
              isSelected={selectedItems.has(item.id)}
              onSelect={() => onSelect(item.id)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};