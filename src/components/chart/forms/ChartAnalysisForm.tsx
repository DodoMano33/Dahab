import { useState } from "react";
import { TradingViewSelector } from "@/components/TradingViewSelector";

interface ChartAnalysisFormProps {
  onSubmit: (
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
  isAnalyzing: boolean;
  onHistoryClick?: () => void;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick,
  defaultSymbol,
  defaultPrice
}: ChartAnalysisFormProps) => {
  const [customHours, setCustomHours] = useState<string>("8");

  const handleSubmit = (symbol: string, timeframe: string, currentPrice?: number) => {
    if (currentPrice) {
      onSubmit(symbol, timeframe, currentPrice);
    }
  };

  return (
    <div className="space-y-4">
      <TradingViewSelector
        onConfigSubmit={handleSubmit}
        isLoading={isAnalyzing}
        onHistoryClick={onHistoryClick}
        defaultSymbol={defaultSymbol}
        defaultPrice={defaultPrice}
      />
    </div>
  );
};