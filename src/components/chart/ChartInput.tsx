
import { ChartAnalysisForm } from "./forms/ChartAnalysisForm";

interface ChartInputProps {
  mode: "tradingview";
  onTradingViewConfig: (
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
    duration?: string,
    selectedTypes?: string[]
  ) => void;
  onHistoryClick?: () => void;
  isAnalyzing: boolean;
  currentAnalysis?: string;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const ChartInput = ({
  onTradingViewConfig,
  onHistoryClick,
  isAnalyzing,
  currentAnalysis,
  defaultSymbol,
  defaultPrice
}: ChartInputProps) => {
  return (
    <ChartAnalysisForm
      onSubmit={onTradingViewConfig}
      isAnalyzing={isAnalyzing}
      onHistoryClick={onHistoryClick || (() => {})}
      currentAnalysis={currentAnalysis}
      defaultSymbol={defaultSymbol}
      defaultPrice={defaultPrice}
    />
  );
};
