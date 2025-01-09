import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { SearchHistoryItem } from "@/types/analysis";

interface HistoryContentProps {
  history: SearchHistoryItem[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isAllSelected: boolean;
  onSelectAll: () => void;
}

export const HistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onDelete,
  isAllSelected,
  onSelectAll,
}: HistoryContentProps) => {
  return (
    <Table>
      <HistoryTableHeader 
        showCheckbox={true}
        onSelectAll={onSelectAll}
        isAllSelected={isAllSelected}
      />
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
  );
};