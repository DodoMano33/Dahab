
import { useState, useMemo, ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisTabContent } from "./AnalysisTabContent";
import { AnalyticsDashboard } from "../dashboard/AnalyticsDashboard";
import { SearchHistoryItem } from "@/types/analysis";

interface ChartAnalyzerTabsProps {
  searchHistoryStats: { total: number; active: number; completed: number };
  isRefreshing: boolean;
  autoSymbol: string;
  onSymbolChange: (symbol: string) => void;
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

export const ChartAnalyzerTabs = ({
  searchHistoryStats,
  isRefreshing,
  autoSymbol,
  onSymbolChange,
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
}: ChartAnalyzerTabsProps) => {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 w-full mb-4">
        <TabsTrigger value="analysis">التحليل</TabsTrigger>
        <TabsTrigger value="dashboard">الإحصائيات</TabsTrigger>
      </TabsList>
      
      <TabsContent value="analysis" className="space-y-6 animate-fade-in">
        <AnalysisTabContent 
          searchHistoryStats={searchHistoryStats}
          isRefreshing={isRefreshing}
          autoSymbol={autoSymbol}
          onSymbolChange={onSymbolChange}
          onAddToSearchHistory={onAddToSearchHistory}
          isAnalyzing={isAnalyzing}
          currentAnalysis={currentAnalysis}
          onTimeframesChange={onTimeframesChange}
          onIntervalChange={onIntervalChange}
          setIsHistoryOpen={setIsHistoryOpen}
          onAnalysisComplete={onAnalysisComplete}
          chartDisplayComponent={chartDisplayComponent}
          onManualCheck={onManualCheck}
          isCheckLoading={isCheckLoading}
          lastCheckTime={lastCheckTime}
        />
      </TabsContent>
      
      <TabsContent value="dashboard" className="animate-fade-in">
        <AnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};
