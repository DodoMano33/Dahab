
import { ChartInput } from "../ChartInput";
import { useAnalysisSubmit } from "./hooks/useAnalysisSubmit";
import { SearchHistoryItem } from "@/types/analysis";

interface AnalysisFormProps {
  onAnalysis: (item: SearchHistoryItem) => void;
  isAnalyzing: boolean;
  currentAnalysis?: string;
  onHistoryClick?: () => void;
  defaultSymbol?: string;
}

export const AnalysisForm = ({ 
  onAnalysis, 
  isAnalyzing, 
  currentAnalysis,
  onHistoryClick,
  defaultSymbol,
}: AnalysisFormProps) => {
  const { handleAnalysis } = useAnalysisSubmit({ onAnalysis });

  return (
    <ChartInput
      mode="tradingview"
      onTradingViewConfig={(
        symbol: string, 
        timeframe: string, 
        isScalping?: boolean,
        isAI?: boolean,
        isSMC?: boolean,
        isICT?: boolean,
        isTurtleSoup?: boolean,
        isGann?: boolean,
        isWaves?: boolean,
        isPatternAnalysis?: boolean,
        isPriceAction?: boolean,
        isNeuralNetwork?: boolean,
        isRNN?: boolean,
        isTimeClustering?: boolean,
        isMultiVariance?: boolean,
        isCompositeCandlestick?: boolean,
        isBehavioral?: boolean,
        isFibonacci?: boolean,
        isFibonacciAdvanced?: boolean,
        duration?: string
      ) => {
        return handleAnalysis(
          symbol, 
          timeframe, 
          isScalping, 
          isAI, 
          isSMC, 
          isICT, 
          isTurtleSoup, 
          isGann, 
          isWaves, 
          isPatternAnalysis, 
          isPriceAction, 
          isNeuralNetwork,
          isRNN, 
          isTimeClustering, 
          isMultiVariance, 
          isCompositeCandlestick, 
          isBehavioral,
          isFibonacci,
          isFibonacciAdvanced,
          duration
        );
      }}
      onHistoryClick={onHistoryClick}
      isAnalyzing={isAnalyzing}
    />
  );
};
