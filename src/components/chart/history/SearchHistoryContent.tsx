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

  console.log("Selected Items:", selectedItems); // Debug log

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
    console.log("Updating selected items:", newSelected); // Debug log
    setSelectedItems(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div className="sticky top-0 z-50 bg-background space-y-4">
          <SearchHistoryToolbar
            selectedItems={selectedItems}
            onDelete={onDelete}
            validHistory={validHistory}
          />

          {/* Table Header */}
          <div className="border rounded-t-md bg-background">
            <Table>
              <HistoryTableHeader showCheckbox={true} />
            </Table>
          </div>
        </div>

        {/* Table Body */}
        <ScrollArea className="h-[calc(85vh-16rem)] border-x border-b rounded-b-md">
          <Table>
            <TableBody>
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
        </ScrollArea>
      </div>
    </div>
  );
};