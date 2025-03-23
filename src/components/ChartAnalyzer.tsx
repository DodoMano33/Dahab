
import { useState, useCallback, useEffect, useMemo } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { HistoryDialog } from "./chart/history/HistoryDialog";
import { ChartDisplay } from "./chart/ChartDisplay";
import { useSearchHistory } from "./hooks/search-history";
import { ChartAnalyzerTabs } from "./chart/tabs/ChartAnalyzerTabs";
import { useQueryClient } from "@tanstack/react-query";
import { SearchHistoryItem } from "@/types/analysis";
import { useBackTest } from "./hooks/useBackTest";

export function ChartAnalyzer() {
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
    addToSearchHistory,
    refreshSearchHistory,
    isRefreshing
  } = useSearchHistory();

  const { triggerManualCheck, isLoading: isCheckLoading, lastCheckTime } = useBackTest();

  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [autoSymbol, setAutoSymbol] = useState<string>("XAUUSD");
  const [autoPrice, setAutoPrice] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const analysisStats = useMemo(() => {
    const activeAnalyses = searchHistory.filter(item => !item?.result_timestamp);
    const completedAnalyses = searchHistory.filter(item => item?.result_timestamp);
    return { total: searchHistory.length, active: activeAnalyses.length, completed: completedAnalyses.length };
  }, [searchHistory]);

  const handleTimeframesChange = useCallback((timeframes: string[]) => {
    if (!timeframes) {
      console.log("No timeframes provided");
      return;
    }
    setSelectedTimeframes(timeframes);
    console.log("Selected timeframes:", timeframes);
  }, []);

  const handleIntervalChange = useCallback((interval: string) => {
    if (!interval) {
      console.log("No interval provided");
      return;
    }
    setSelectedInterval(interval);
    console.log("Selected interval:", interval);
  }, []);

  const handleSymbolChange = useCallback((symbol: string) => {
    console.log("Chart symbol changed to:", symbol);
    setAutoSymbol(symbol);
  }, []);

  const handlePriceUpdate = useCallback((price: number) => {
    console.log("Chart price updated to:", price);
    setAutoPrice(price);
  }, []);

  const handleAnalysisComplete = useCallback((newItem: SearchHistoryItem) => {
    console.log("New analysis completed, adding to history:", newItem);
    addToSearchHistory(newItem);
    setIsHistoryOpen(true);
  }, [addToSearchHistory, setIsHistoryOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [queryClient]);

  const chartDisplayComponent = useMemo(() => {
    if (image || analysis || isAnalyzing) {
      return (
        <ChartDisplay
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
      );
    }
    return null;
  }, [image, analysis, isAnalyzing, currentSymbol, currentAnalysis, setImage, setAnalysis]);

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <ChartAnalyzerTabs
        searchHistoryStats={analysisStats}
        isRefreshing={isRefreshing}
        autoSymbol={autoSymbol}
        autoPrice={autoPrice}
        onSymbolChange={handleSymbolChange}
        onPriceUpdate={handlePriceUpdate}
        onAddToSearchHistory={addToSearchHistory}
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
        onTimeframesChange={handleTimeframesChange}
        onIntervalChange={handleIntervalChange}
        setIsHistoryOpen={setIsHistoryOpen}
        onAnalysisComplete={handleAnalysisComplete}
        chartDisplayComponent={chartDisplayComponent}
        onManualCheck={triggerManualCheck}
        isCheckLoading={isCheckLoading}
        lastCheckTime={lastCheckTime}
      />
      
      {isHistoryOpen && (
        <HistoryDialog
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={searchHistory}
          onDelete={handleDeleteHistoryItem}
          refreshHistory={refreshSearchHistory}
          isRefreshing={isRefreshing}
        />
      )}
    </div>
  );
}

// Default export
export default ChartAnalyzer;
