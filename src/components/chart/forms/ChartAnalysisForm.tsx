import { TradingViewSelector } from "../../TradingViewSelector";

interface ChartAnalysisFormProps {
  onSubmit: (
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
  ) => void;
  isAnalyzing: boolean;
  onHistoryClick?: () => void;
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick
}: ChartAnalysisFormProps) => {
  const handleConfigSubmit = (
    symbol: string,
    timeframe: string,
    currentPrice?: number,
    customHours?: number
  ) => {
    onSubmit(symbol, timeframe, currentPrice, customHours);
  };

  return (
    <TradingViewSelector
      onConfigSubmit={handleConfigSubmit}
      isLoading={isAnalyzing}
      onHistoryClick={onHistoryClick || (() => {})}
    />
  );
};