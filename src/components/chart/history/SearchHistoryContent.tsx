import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { SearchHistoryItem } from "@/types/analysis";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <ScrollArea className="w-full rounded-md border">
        <div className="min-w-[800px]">
          <div className="sticky top-0 z-50 bg-background border-b">
            <SearchHistoryToolbar
              selectedItems={selectedItems}
              onDelete={onDelete}
              validHistory={validHistory}
              dateRange={dateRange}
              isDatePickerOpen={isDatePickerOpen}
              setIsDatePickerOpen={setIsDatePickerOpen}
              setDateRange={setDateRange}
            />
          </div>

          <Table>
            <HistoryTableHeader 
              showCheckbox={true}
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
              someSelected={someSelected}
            />
            <TableBody className="bg-background">
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
      </ScrollArea>
    </div>
  );
};