import { HistoryContent } from "./HistoryContent";
import { AnalysisData, AnalysisType } from "@/types/analysis";

interface SearchHistoryMainProps {
  history: Array<{
    id: string;
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    targetHit?: boolean;
    stopLossHit?: boolean;
    analysisType: AnalysisType;
    timeframe: string;
    analysis_duration_hours?: number;
  }>;
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SearchHistoryMain = ({
  history,
  selectedItems,
  onSelect,
  onDelete,
}: SearchHistoryMainProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <HistoryContent
          history={history}
          selectedItems={selectedItems}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};