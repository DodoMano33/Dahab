
import { useState } from "react";
import { SearchHistoryItem } from "@/types/analysis";
import { HistoryContent } from "./HistoryContent";
import { AnalysisChartDisplay } from "../AnalysisChartDisplay";
import { Separator } from "@/components/ui/separator";

interface SearchHistoryContentProps {
  history: SearchHistoryItem[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
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
  const [showChart, setShowChart] = useState(true);

  return (
    <div className="flex flex-col space-y-4">
      {showChart && (
        <>
          <AnalysisChartDisplay 
            searchHistory={history} 
            isRefreshing={isRefreshing} 
            onRefresh={refreshHistory} 
          />
          <Separator />
        </>
      )}
      
      <HistoryContent
        history={history}
        selectedItems={selectedItems}
        onSelect={onSelect}
        onSelectAll={onSelectAll}
        onDelete={onDelete}
      />
    </div>
  );
};
