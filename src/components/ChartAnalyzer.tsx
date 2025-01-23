import { useState, useCallback } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useBackTest } from "./hooks/useBackTest";
import { ChartManager } from "./chart/components/ChartManager";
import { AnalysisManager } from "./chart/analysis/components/AnalysisManager";
import { HistoryManager } from "./chart/history/components/HistoryManager";

export const ChartAnalyzer = () => {
  const {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    currentAnalysis,
    setImage,
    setAnalysis,
  } = useAnalysisHandler();

  const {
    searchHistory,
    isHistoryOpen,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory
  } = useSearchHistory();

  useBackTest();

  const [autoSymbol, setAutoSymbol] = useState<string>("XAUUSD");
  const [autoPrice, setAutoPrice] = useState<number | null>(null);
  const [analysisDuration, setAnalysisDuration] = useState<string>("8");

  const handleSymbolChange = useCallback((symbol: string) => {
    console.log("Chart symbol changed to:", symbol);
    setAutoSymbol(symbol);
  }, []);

  const handlePriceUpdate = useCallback((price: number) => {
    console.log("Chart price updated to:", price);
    setAutoPrice(price);
  }, []);

  const handleAnalysisComplete = (newItem: any) => {
    console.log("New analysis completed, adding to history:", newItem);
    addToSearchHistory(newItem);
    setIsHistoryOpen(true);
  };

  const handleAnalysisDurationChange = (duration: string) => {
    console.log("Analysis duration changed to:", duration);
    setAnalysisDuration(duration);
  };

  const handleHistoryClose = () => {
    console.log("Closing history dialog");
    setIsHistoryOpen(false);
  };

  console.log("Current search history:", searchHistory);
  console.log("History dialog open state:", isHistoryOpen);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <ChartManager
        symbol={autoSymbol}
        onSymbolChange={handleSymbolChange}
        onPriceUpdate={handlePriceUpdate}
      />

      <AnalysisManager
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
        autoSymbol={autoSymbol}
        autoPrice={autoPrice}
        analysisDuration={analysisDuration}
        onAnalysis={addToSearchHistory}
        onAnalysisComplete={handleAnalysisComplete}
        onDurationChange={handleAnalysisDurationChange}
        image={image}
        analysis={analysis}
        onClose={() => {
          setImage(null);
          setAnalysis(null);
        }}
        symbol={currentSymbol}
      />
      
      <HistoryManager
        isOpen={isHistoryOpen}
        onClose={handleHistoryClose}
        history={searchHistory || []}
        onDelete={handleDeleteHistoryItem}
      />
    </div>
  );
};