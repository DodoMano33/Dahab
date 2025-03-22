
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHistoryItem } from "@/types/analysis";
import { useState } from "react";
import { HistoryTable } from "./HistoryTable";
import { useHistoryContentData } from "./hooks/useHistoryContentData";

interface HistoryContentProps {
  history: Array<SearchHistoryItem>;
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onSelectAll?: (checked: boolean) => void;
}

export const HistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onDelete,
  onSelectAll,
}: HistoryContentProps) => {
  console.log("HistoryContent rendered with history items:", history.length);
  console.log("Sample first history item last_checked_at:", 
    history.length > 0 ? 
    `${history[0].id}: ${history[0].last_checked_at} (${typeof history[0].last_checked_at})` : 
    "No history items");
  
  const { localHistory } = useHistoryContentData(history);
  
  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    } else {
      if (checked) {
        const allIds = localHistory.map(item => item.id);
        allIds.forEach(id => onSelect(id));
      } else {
        localHistory.forEach(item => {
          if (selectedItems.has(item.id)) {
            onSelect(item.id);
          }
        });
      }
    }
  };

  const isAllSelected = localHistory.length > 0 && selectedItems.size === localHistory.length;

  return (
    <div className="relative w-full h-full bg-white dark:bg-gray-950 rounded-md shadow-sm border border-slate-200 dark:border-slate-800">
      <ScrollArea className="h-full overflow-hidden">
        <div className="overflow-x-auto">
          <HistoryTable 
            history={localHistory}
            selectedItems={selectedItems}
            onSelect={onSelect}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
