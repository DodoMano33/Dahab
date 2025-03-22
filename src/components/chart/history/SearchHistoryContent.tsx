
import { HistoryContent } from "./HistoryContent";
import { SearchHistoryItem } from "@/types/analysis";
import { Separator } from "@/components/ui/separator";
import { HistoryChartSection } from "./HistoryChartSection";

interface SearchHistoryContentProps {
  history: SearchHistoryItem[];
  selectedItems: Set<string>;
  onSelect: (id: string) => Promise<void>;
  onSelectAll: (checked: boolean) => void;
  onDelete: (id: string) => Promise<void>;
  isRefreshing: boolean;
  refreshHistory: () => Promise<void>;
}

export const SearchHistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onSelectAll,
  onDelete,
  isRefreshing,
  refreshHistory
}: SearchHistoryContentProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <HistoryChartSection
        searchHistory={history}
        isRefreshing={isRefreshing}
        onRefresh={refreshHistory}
      />
      
      <Separator />
      
      <HistoryContent
        history={history}
        selectedItems={selectedItems}
        onSelect={onSelect}
        onDelete={onDelete}
        onSelectAll={onSelectAll}
      />
    </div>
  );
};
