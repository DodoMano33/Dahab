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
}

export const AnalysisForm = ({ 
  onAnalysis, 
  isAnalyzing, 
  currentAnalysis,
  onHistoryClick,
  defaultSymbol,
  defaultPrice
}: AnalysisFormProps) => {
  const { handleAnalysis } = useAnalysisSubmit({ onAnalysis });

  return (
    <ChartInput
      mode="tradingview"
      onTradingViewConfig={(
        symbol: string,
        timeframe: string,
        providedPrice?: number,
        customHours?: number,
        isScalping?: boolean,
        isAI?: boolean,
        isSMC?: boolean,
        isICT?: boolean,
        isTurtleSoup?: boolean,
        isGann?: boolean,
        isWaves?: boolean,
        isPatternAnalysis?: boolean,
        isPriceAction?: boolean
      ) => handleAnalysis(
        symbol,
        timeframe,
        providedPrice,
        customHours,
        isScalping,
        isAI,
        isSMC,
        isICT,
        isTurtleSoup,
        isGann,
        isWaves,
        isPatternAnalysis,
        isPriceAction
      )}
      onHistoryClick={onHistoryClick}
      isAnalyzing={isAnalyzing}
    />
  );
};