import { Table, TableBody } from "@/components/ui/table";
import { SearchHistoryItem } from "@/types/analysis";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  console.log("Selected Items in HistoryContent:", selectedItems); // Debug log

  return (
    <div className="relative">
      <Table>
        <HistoryTableHeader showCheckbox={true} />
        <TableBody>
          {history.map((item) => (
            <HistoryRow
              key={item.id}
              {...item}
              isSelected={selectedItems.has(item.id)}
              onSelect={() => onSelect(item.id)}
              target_hit={item.targetHit}
              stop_loss_hit={item.stopLossHit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};