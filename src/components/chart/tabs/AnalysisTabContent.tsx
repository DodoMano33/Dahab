
import { ReactNode, useState } from "react";
import { AnalysisInfoCard } from "../info/AnalysisInfoCard";
import { LiveTradingViewChart } from "../LiveTradingViewChart";
import { AnalysisForm } from "../analysis/AnalysisForm";
import { AnalysisSettings } from "../analysis/AnalysisSettings";
import { BacktestCheckButton } from "../backtest/BacktestCheckButton";
import { SearchHistoryItem } from "@/types/analysis";

interface AnalysisTabContentProps {
  searchHistoryStats: { total: number; active: number; completed: number };
  isRefreshing: boolean;
  autoSymbol: string;
  autoPrice: number | null;
  onSymbolChange: (symbol: string) => void;
  onPriceUpdate: (price: number) => void;
  onAddToSearchHistory: (item: SearchHistoryItem) => void;
  isAnalyzing: boolean;
  currentAnalysis: string;
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
  setIsHistoryOpen: (open: boolean) => void;
  onAnalysisComplete: (newItem: SearchHistoryItem) => void;
  chartDisplayComponent: ReactNode;
  onManualCheck: () => void;
  isCheckLoading: boolean;
  lastCheckTime: Date | null;
}

export const AnalysisTabContent = ({
  searchHistoryStats,
  isRefreshing,
  autoSymbol,
  autoPrice,
  onSymbolChange,
  onPriceUpdate,
  onAddToSearchHistory,
  isAnalyzing,
  currentAnalysis,
  onTimeframesChange,
  onIntervalChange,
  setIsHistoryOpen,
  onAnalysisComplete,
  chartDisplayComponent,
  onManualCheck,
  isCheckLoading,
  lastCheckTime
}: AnalysisTabContentProps) => {
  const [chartRef, setChartRef] = useState<any>(null);

  // Function to update the TradingView chart symbol
  const updateChartSymbol = (symbol: string) => {
    // Prepare symbol for TradingView format (add exchange if needed)
    const formattedSymbol = symbol.includes(':') 
      ? symbol 
      : determineExchangePrefix(symbol);
    
    console.log(`Updating TradingView chart to symbol: ${formattedSymbol}`);
    onSymbolChange(symbol); // This will update the parent state
  };

  // Helper function to determine the appropriate exchange prefix
  const determineExchangePrefix = (symbol: string): string => {
    const upperSymbol = symbol.toUpperCase();
    
    // Common patterns for different types of symbols
    if (upperSymbol.includes('USD') && !upperSymbol.includes('USDT')) {
      // Forex pairs
      if (upperSymbol === 'XAUUSD' || upperSymbol === 'GOLD') {
        return `CAPITALCOM:GOLD`;
      } else if (upperSymbol === 'XAGUSD' || upperSymbol === 'SILVER') {
        return `CAPITALCOM:SILVER`;
      } else {
        return `FX:${upperSymbol}`;
      }
    } else if (
      upperSymbol.endsWith('USDT') || 
      upperSymbol.endsWith('BTC') || 
      upperSymbol.includes('BTC') || 
      upperSymbol.includes('ETH')
    ) {
      // Crypto pairs
      return `BINANCE:${upperSymbol}`;
    } else {
      // Stocks and others - default to NASDAQ
      return `NASDAQ:${upperSymbol}`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* معلومات سريعة */}
      <AnalysisInfoCard 
        total={searchHistoryStats.total}
        active={searchHistoryStats.active}
        completed={searchHistoryStats.completed}
        isRefreshing={isRefreshing}
      />

      {/* TradingView Chart */}
      <LiveTradingViewChart
        symbol={autoSymbol.includes(':') ? autoSymbol : determineExchangePrefix(autoSymbol)}
        onSymbolChange={onSymbolChange}
        onPriceUpdate={onPriceUpdate}
        setSymbol={setChartRef}
      />

      {/* Symbol, Price, and Timeframe Form */}
      <AnalysisForm
        onAnalysis={onAddToSearchHistory}
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
        onUpdateChartSymbol={updateChartSymbol}
      />

      {/* Auto Analysis Settings */}
      <AnalysisSettings
        onTimeframesChange={onTimeframesChange}
        onIntervalChange={onIntervalChange}
        setIsHistoryOpen={setIsHistoryOpen}
        onAnalysisComplete={onAnalysisComplete}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
      />
      
      {/* Manual Analysis Display */}
      {chartDisplayComponent}
      
      {/* Backtest Check Button */}
      <BacktestCheckButton 
        onCheck={onManualCheck}
        isLoading={isCheckLoading}
        lastCheckTime={lastCheckTime}
      />
    </div>
  );
};
