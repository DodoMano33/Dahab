
import { Table } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryTableBody } from "./HistoryTableBody";
import { SearchHistoryItem } from "@/types/analysis";

interface HistoryTableProps {
  history: SearchHistoryItem[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
}

export const HistoryTable = ({
  history,
  selectedItems,
  onSelect,
  onSelectAll,
  isAllSelected
}: HistoryTableProps) => {
  return (
    <Table className="w-full min-w-max">
      <HistoryTableHeader 
        showCheckbox={true} 
        onSelectAll={onSelectAll}
        isAllSelected={isAllSelected}
      />
      <HistoryTableBody 
        history={history}
        selectedItems={selectedItems}
        onSelect={onSelect}
      />
    </Table>
  );
};
