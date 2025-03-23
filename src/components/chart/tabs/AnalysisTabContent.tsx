
import { ReactNode } from "react";
import { AnalysisInfoCard } from "../info/AnalysisInfoCard";
import { LiveTradingViewChart } from "../LiveTradingViewChart";
import { AnalysisForm } from "../analysis/AnalysisForm";
import { AnalysisSettings } from "../analysis/AnalysisSettings";
import { BacktestCheckButton } from "../backtest/BacktestCheckButton";
import { SearchHistoryItem } from "@/types/analysis";
import { PriceLevelsDisplay } from "../PriceLevelsDisplay";
import { Toaster } from "sonner";

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
  onManualCheck?: () => void;
  isCheckLoading?: boolean;
  lastCheckTime?: Date | null;
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
}: AnalysisTabContentProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-center" expand={true} richColors closeButton />
      
      {/* معلومات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AnalysisInfoCard 
            total={searchHistoryStats.total}
            active={searchHistoryStats.active}
            completed={searchHistoryStats.completed}
            isRefreshing={isRefreshing}
          />
        </div>
        <div className="md:col-span-1">
          <PriceLevelsDisplay />
        </div>
      </div>

      {/* TradingView Chart */}
      <LiveTradingViewChart
        symbol={autoSymbol}
        onSymbolChange={onSymbolChange}
        onPriceUpdate={onPriceUpdate}
      />

      {/* Symbol, Price, and Timeframe Form */}
      <AnalysisForm
        onAnalysis={onAddToSearchHistory}
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
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
      
      {/* فقط عرض زر فحص التحليلات بدون وظيفة */}
      <BacktestCheckButton />
    </div>
  );
};
