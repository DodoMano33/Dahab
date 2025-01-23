import { useState, useCallback } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisForm } from "./chart/analysis/AnalysisForm";
import { HistoryDialog } from "./chart/history/HistoryDialog";
import { AnalysisSettings } from "./chart/analysis/AnalysisSettings";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useBackTest } from "./hooks/useBackTest";
import { LiveTradingViewChart } from "./chart/LiveTradingViewChart";
import { AnalysisContainer } from "./chart/analysis/components/AnalysisContainer";

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
    searchHistory = [],
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

  return (
    <div className="flex flex-col space-y-6 p-6">
      <LiveTradingViewChart
        symbol={autoSymbol}
        onSymbolChange={handleSymbolChange}
        onPriceUpdate={handlePriceUpdate}
      />

      <AnalysisForm
        onAnalysis={addToSearchHistory}
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
        defaultDuration={analysisDuration}
        onDurationChange={handleAnalysisDurationChange}
      />

      <AnalysisSettings
        onAnalysisComplete={handleAnalysisComplete}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
        defaultDuration={analysisDuration}
      />
      
      <AnalysisContainer
        image={image}
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onClose={() => {
          setImage(null);
          setAnalysis(null);
        }}
        symbol={currentSymbol}
        currentAnalysis={currentAnalysis}
      />
      
      {isHistoryOpen && (
        <HistoryDialog
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={searchHistory}
          onDelete={handleDeleteHistoryItem}
        />
      )}
    </div>
  );
};