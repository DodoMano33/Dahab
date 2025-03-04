
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
  onHistoryClick?: () => void;  // Made optional with ?
  isAnalyzing: boolean;
}

export const ChartInput = ({
  onTradingViewConfig,
  onHistoryClick,
  isAnalyzing
}: ChartInputProps) => {
  return (
    <ChartAnalysisForm
      onSubmit={onTradingViewConfig}
      isAnalyzing={isAnalyzing}
      onHistoryClick={onHistoryClick || (() => {})}
    />
  );
};
