import { ChartInput } from "../ChartInput";
import { useAnalysisSubmit } from "./hooks/useAnalysisSubmit";
import { SearchHistoryItem } from "@/types/analysis";

interface AnalysisFormProps {
  onAnalysis: (item: SearchHistoryItem) => void;
  isAnalyzing: boolean;
  currentAnalysis?: string;
  onHistoryClick?: () => void;
  defaultSymbol?: string;
  defaultPrice?: number | null;
  defaultDuration?: string;
  onDurationChange?: (duration: string) => void;
}

export const AnalysisForm = ({ 
  onAnalysis, 
  isAnalyzing, 
  currentAnalysis,
  onHistoryClick,
  defaultSymbol,
  defaultPrice,
  defaultDuration,
  onDurationChange
}: AnalysisFormProps) => {
  const { handleAnalysis } = useAnalysisSubmit({ onAnalysis });

  return (
    <div className="space-y-4">
      <ChartInput
        mode="tradingview"
        onTradingViewConfig={handleAnalysis}
        onHistoryClick={onHistoryClick}
        isAnalyzing={isAnalyzing}
        defaultSymbol={defaultSymbol}
        defaultPrice={defaultPrice}
        defaultDuration={defaultDuration}
        onDurationChange={onDurationChange}
      />
    </div>
  );
};