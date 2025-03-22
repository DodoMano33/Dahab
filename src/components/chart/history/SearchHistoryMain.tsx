
import { HistoryContent } from "./HistoryContent";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { useCurrentPrice } from "@/hooks/current-price";

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
  // استخدام السعر الحقيقي للذهب
  const { currentPrice } = useCurrentPrice();
  
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
      {currentPrice && (
        <div className="absolute bottom-2 right-4 text-xs p-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
          سعر الذهب الحالي: {currentPrice}
        </div>
      )}
    </div>
  );
};
