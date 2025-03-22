
import { SearchHistoryContent } from "./SearchHistoryContent";
import { SearchHistoryItem } from "@/types/analysis";
import { useState } from "react";

interface SearchHistoryMainProps {
  history: SearchHistoryItem[];
  onSelect: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  selectedItems: Set<string>;
  isRefreshing: boolean;
  refreshHistory: () => Promise<void>;
}

export const SearchHistoryMain = ({ 
  history, 
  onSelect, 
  onDelete,
  selectedItems,
  isRefreshing,
  refreshHistory
}: SearchHistoryMainProps) => {
  const handleSelectAll = (checked: boolean) => {
    // This logic will be handled in HistoryContent
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <SearchHistoryContent
        history={history}
        selectedItems={selectedItems}
        onSelect={onSelect}
        onDelete={onDelete}
        onSelectAll={handleSelectAll}
        isRefreshing={isRefreshing}
        refreshHistory={refreshHistory}
      />
    </div>
  );
};
