
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
    duration?: string
  ) => void;
  onHistoryClick?: () => void;
  isAnalyzing: boolean;
  defaultSymbol?: string;
  defaultPrice?: number | null;
  onUpdateChartSymbol?: (symbol: string) => void;
}

export const ChartInput = ({
  onTradingViewConfig,
  onHistoryClick,
  isAnalyzing,
  defaultSymbol,
  defaultPrice,
  onUpdateChartSymbol
}: ChartInputProps) => {
  return (
    <ChartAnalysisForm
      onSubmit={onTradingViewConfig}
      isAnalyzing={isAnalyzing}
      onHistoryClick={onHistoryClick || (() => {})}
      defaultSymbol={defaultSymbol}
      defaultPrice={defaultPrice}
      onUpdateChartSymbol={onUpdateChartSymbol}
    />
  );
};
