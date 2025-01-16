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
  return (
    <div className="relative rounded-md border bg-background">
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
  );
};