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
    isPatternAnalysis?: boolean
  ) => void;
  onHistoryClick: () => void;
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
      onHistoryClick={onHistoryClick}
    />
  );
};