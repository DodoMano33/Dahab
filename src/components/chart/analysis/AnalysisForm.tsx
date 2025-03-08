
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
        // استخدام القيم الافتراضية إن لم يتم تحديد قيم
        const finalSymbol = symbol || defaultSymbol || "";
        const finalPrice = providedPrice || defaultPrice || 0;
        
        console.log("Analysis form using values:", {
          symbol: finalSymbol,
          price: finalPrice,
          defaultSymbol,
          defaultPrice
        });
        
        return handleAnalysis(
          finalSymbol, 
          timeframe, 
          finalPrice, 
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
      defaultSymbol={defaultSymbol}
      defaultPrice={defaultPrice}
    />
  );
};
