import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { SearchHistoryItem } from "@/types/analysis";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { SearchHistoryToolbar } from "./SearchHistoryToolbar";

interface SearchHistoryContentProps {
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const SearchHistoryContent = ({ history, onDelete }: SearchHistoryContentProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === validHistory.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = validHistory.map(item => item.id);
      setSelectedItems(new Set(allIds));
    }
  };

  const allSelected = validHistory.length > 0 && selectedItems.size === validHistory.length;
  const someSelected = selectedItems.size > 0 && selectedItems.size < validHistory.length;

  return (
    <div className="space-y-4">
      <SearchHistoryToolbar
        selectedItems={selectedItems}
        onDelete={onDelete}
        validHistory={validHistory}
        dateRange={dateRange}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        setDateRange={setDateRange}
      />

      <div className="border rounded-md overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <HistoryTableHeader 
              showCheckbox={true}
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
              someSelected={someSelected}
            />
            <TableBody className="divide-y">
              {validHistory.map((item) => (
                <HistoryRow
                  key={item.id}
                  {...item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={() => handleSelect(item.id)}
                  target_hit={item.targetHit}
                  stop_loss_hit={item.stopLossHit}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};