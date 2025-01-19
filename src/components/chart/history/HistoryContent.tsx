import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";

interface HistoryContentProps {
  history: any[];
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
  const handleSelectAll = () => {
    if (selectedItems.size === history.length) {
      onSelect("");
    } else {
      history.forEach((item) => onSelect(item.id));
    }
  };

  const allSelected = history.length > 0 && selectedItems.size === history.length;
  const someSelected = selectedItems.size > 0 && selectedItems.size < history.length;

  return (
    <div className="border rounded-md">
      <Table>
        <HistoryTableHeader
          showCheckbox={true}
          onSelectAll={handleSelectAll}
          allSelected={allSelected}
          someSelected={someSelected}
        />
        <TableBody className="divide-y">
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