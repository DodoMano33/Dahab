import { useState } from "react";
import { ChartInput } from "./chart/ChartInput";
import { ChartDisplay } from "./chart/ChartDisplay";
import { SearchHistory } from "./chart/SearchHistory";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisData } from "@/types/analysis";

type SearchHistoryItem = {
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  targetHit?: boolean;
  stopLossHit?: boolean;
};

export const ChartAnalyzer = () => {
  const {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    handleTradingViewConfig,
    setImage,
    setAnalysis,
    setIsAnalyzing
  } = useAnalysisHandler();

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleAnalysis = async (symbol: string, timeframe: string, providedPrice?: number) => {
    const result = await handleTradingViewConfig(symbol, timeframe, providedPrice);
    
    if (result) {
      const { analysisResult, currentPrice, symbol: upperSymbol } = result;
      
      const newHistoryEntry: SearchHistoryItem = {
        date: new Date(),
        symbol: upperSymbol,
        currentPrice,
        analysis: analysisResult,
        targetHit: false,
        stopLossHit: false
      };

      setSearchHistory(prev => [newHistoryEntry, ...prev]);
      console.log("تم تحديث سجل البحث:", newHistoryEntry);
    }
  };

  const handleShowHistory = () => {
    setIsHistoryOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartInput
          mode="tradingview"
          onTradingViewConfig={handleAnalysis}
          onHistoryClick={handleShowHistory}
          isAnalyzing={isAnalyzing}
        />
        <ChartDisplay
          image={image}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onClose={() => {
            setImage(null);
            setAnalysis(null);
            setIsAnalyzing(false);
          }}
          symbol={currentSymbol}
        />
      </div>
      <SearchHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={searchHistory}
      />
    </div>
  );
};