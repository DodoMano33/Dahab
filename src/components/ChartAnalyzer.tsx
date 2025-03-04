import { useState, useCallback } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisForm } from "./chart/analysis/AnalysisForm";
import { HistoryDialog } from "./chart/history/HistoryDialog";
import { ChartDisplay } from "./ChartDisplay";
import { AnalysisSettings } from "./chart/analysis/AnalysisSettings";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useBackTest } from "./hooks/useBackTest";
import { LiveTradingViewChart } from "./chart/LiveTradingViewChart";
import { AnalyticsDashboard } from "./chart/dashboard/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    addToSearchHistory,
    refreshSearchHistory,
    isRefreshing
  } = useSearchHistory();

  const {
    triggerManualCheck,
    isLoading,
    lastCheckTime
  } = useBackTest();

  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [autoSymbol, setAutoSymbol] = useState<string>("XAUUSD");
  const [autoPrice, setAutoPrice] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("analysis");

  const handleTimeframesChange = (timeframes: string[]) => {
    if (!timeframes) {
      console.log("No timeframes provided");
      return;
    }
    setSelectedTimeframes(timeframes);
    console.log("Selected timeframes:", timeframes);
  };

  const handleIntervalChange = (interval: string) => {
    if (!interval) {
      console.log("No interval provided");
      return;
    }
    setSelectedInterval(interval);
    console.log("Selected interval:", interval);
  };

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

  return (
    <div className="flex flex-col space-y-6 p-6">
      <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="analysis">التحليل</TabsTrigger>
          <TabsTrigger value="dashboard">الإحصائيات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-6">
          {/* TradingView Chart */}
          <LiveTradingViewChart
            symbol={autoSymbol}
            onSymbolChange={handleSymbolChange}
            onPriceUpdate={handlePriceUpdate}
          />

          {/* Symbol, Price, and Timeframe Form */}
          <AnalysisForm
            onAnalysis={addToSearchHistory}
            isAnalyzing={isAnalyzing}
            currentAnalysis={currentAnalysis || ""}
            defaultSymbol={autoSymbol}
            defaultPrice={autoPrice}
          />

          {/* Auto Analysis Settings */}
          <AnalysisSettings
            onTimeframesChange={handleTimeframesChange}
            onIntervalChange={handleIntervalChange}
            setIsHistoryOpen={setIsHistoryOpen}
            onAnalysisComplete={handleAnalysisComplete}
            defaultSymbol={autoSymbol}
            defaultPrice={autoPrice}
          />
          
          {/* Manual Analysis Display */}
          {(image || analysis || isAnalyzing) && (
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
          )}
          
          {/* Backtest Check Button */}
          <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium">فحص التحليلات</h3>
              <p className="text-muted-foreground text-sm">فحص التحليلات الحالية ومقارنتها بالأسعار الحالية</p>
              {lastCheckTime && <p className="text-sm text-muted-foreground mt-1">آخر فحص: {lastCheckTime.toLocaleTimeString()}</p>}
            </div>
            <button
              onClick={triggerManualCheck}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              {isLoading ? 'جاري الفحص...' : 'فحص الآن'}
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="dashboard">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
      
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
};
