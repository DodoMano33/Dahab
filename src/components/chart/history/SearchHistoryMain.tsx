
import { SearchHistoryContent } from "./SearchHistoryContent";
import { SearchHistoryItem } from "@/types/analysis";
import { useState } from "react";

interface SearchHistoryMainProps {
  history: SearchHistoryItem[];
  onSelect: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  selectedItems: Set<string>; // Add this prop
}

export const SearchHistoryMain = ({ 
  history, 
  onSelect, 
  onDelete,
  selectedItems
}: SearchHistoryMainProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Any additional refresh logic if needed
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  };

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
      />
    </div>
  );
};
