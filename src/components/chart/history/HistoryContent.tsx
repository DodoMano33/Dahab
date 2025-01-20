import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { AnalysisData, SearchHistoryItem } from "@/types/analysis";

interface HistoryContentProps {
  history: SearchHistoryItem[];
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
  return (
    <div className="relative rounded-md border bg-background h-full overflow-y-auto">
      <div className="overflow-x-auto">
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