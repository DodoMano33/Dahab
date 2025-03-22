import { ReactNode } from "react";
import { AnalysisInfoCard } from "../info/AnalysisInfoCard";
import { LiveTradingViewChart } from "../LiveTradingViewChart";
import { AnalysisForm } from "../analysis/AnalysisForm";
import { AnalysisSettings } from "../analysis/AnalysisSettings";
import { BacktestCheckButton } from "../backtest/BacktestCheckButton";
import { SearchHistoryItem } from "@/types/analysis";
import { ChartButton } from "../history/ChartButton";
import { HistoryPanel } from "../analysis/HistoryPanel";
import { Button } from "@/components/ui/button";

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
  setIsChartOpen: (open: boolean) => void;
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
  setIsChartOpen,
  onAnalysisComplete,
  chartDisplayComponent,
  onManualCheck,
  isCheckLoading,
  lastCheckTime
}: AnalysisTabContentProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <AnalysisInfoCard 
        total={searchHistoryStats.total}
        active={searchHistoryStats.active}
        completed={searchHistoryStats.completed}
        isRefreshing={isRefreshing}
      />

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

      <LiveTradingViewChart
        symbol={autoSymbol}
        onSymbolChange={onSymbolChange}
        onPriceUpdate={onPriceUpdate}
      />

      <AnalysisForm
        onAnalysis={onAddToSearchHistory}
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
      />

      <AnalysisSettings
        onTimeframesChange={onTimeframesChange}
        onIntervalChange={onIntervalChange}
        setIsHistoryOpen={setIsHistoryOpen}
        onAnalysisComplete={onAnalysisComplete}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
      />
      
      {chartDisplayComponent}
      
      <BacktestCheckButton />
    </div>
  );
};
