
import { ReactNode } from "react";
import { AnalysisInfoCard } from "../info/AnalysisInfoCard";
import { LiveTradingViewChart } from "../LiveTradingViewChart";
import { AnalysisForm } from "../analysis/AnalysisForm";
import { AnalysisSettings } from "../analysis/AnalysisSettings";
import { BacktestCheckButton } from "../backtest/BacktestCheckButton";
import { SearchHistoryItem } from "@/types/analysis";
import { ChartButton } from "../history/ChartButton";
import { HistoryPanel } from "../analysis/HistoryPanel";

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
  setIsChartOpen: (open: boolean) => void; // إضافة خاصية جديدة
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
  setIsChartOpen, // إضافة المتغير الجديد للمعاملات
  onAnalysisComplete,
  chartDisplayComponent,
  onManualCheck,
  isCheckLoading,
  lastCheckTime
}: AnalysisTabContentProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* معلومات سريعة */}
      <AnalysisInfoCard 
        total={searchHistoryStats.total}
        active={searchHistoryStats.active}
        completed={searchHistoryStats.completed}
        isRefreshing={isRefreshing}
      />

      {/* أزرار الرسم البياني وسجل البحث */}
      <div className="flex flex-wrap gap-3">
        <ChartButton onClick={() => setIsChartOpen(true)} />
        <Button 
          variant="outline" 
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center justify-center gap-2"
        >
          <span>سجل البحث</span>
        </Button>
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
