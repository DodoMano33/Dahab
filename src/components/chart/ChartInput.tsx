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
    isPriceAction?: boolean
  ) => void;
  onHistoryClick?: () => void;
  isAnalyzing: boolean;
  defaultSymbol?: string;
  defaultPrice?: number | null;
  defaultDuration?: string;
  onDurationChange?: (duration: string) => void;
}

export const ChartInput = ({
  onTradingViewConfig,
  onHistoryClick,
  isAnalyzing,
  defaultSymbol,
  defaultPrice,
  defaultDuration,
  onDurationChange
}: ChartInputProps) => {
  return (
    <ChartAnalysisForm
      onSubmit={onTradingViewConfig}
      isAnalyzing={isAnalyzing}
      onHistoryClick={onHistoryClick}
      defaultSymbol={defaultSymbol}
      defaultPrice={defaultPrice}
      defaultDuration={defaultDuration}
      onDurationChange={onDurationChange}
    />
  );
};