
import { useState, useCallback, memo, useEffect, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analysisTypeTooltips, timeframeTooltips, AnalysisTooltip } from "@/components/ui/tooltips/AnalysisTooltips";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

// مكون العرض الممويز للتحليل
const MemoizedChartDisplay = memo(ChartDisplay);

// مكون العرض الممويز للرسم البياني المباشر
const MemoizedLiveTradingViewChart = memo(LiveTradingViewChart);

// مكون زر فحص التحليلات المموْيز
const BacktestCheckButton = memo(({ 
  onCheck, 
  isLoading, 
  lastCheckTime 
}: { 
  onCheck: () => void; 
  isLoading: boolean; 
  lastCheckTime: Date | null;
}) => (
  <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
    <div className="flex flex-col">
      <h3 className="text-lg font-medium">فحص التحليلات</h3>
      <p className="text-muted-foreground text-sm">فحص التحليلات الحالية ومقارنتها بالأسعار الحالية</p>
      {lastCheckTime && <p className="text-sm text-muted-foreground mt-1">آخر فحص: {lastCheckTime.toLocaleTimeString()}</p>}
    </div>
    <button
      onClick={onCheck}
      disabled={isLoading}
      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
    >
      {isLoading ? 'جاري الفحص...' : 'فحص الآن'}
    </button>
  </div>
));

// مكون بطاقة المعلومات
const InfoCard = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
));

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
  const queryClient = useQueryClient();

  // استخدام useMemo لحساب إحصائيات التحليلات بكفاءة
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

  const handleAnalysisComplete = useCallback((newItem: any) => {
    console.log("New analysis completed, adding to history:", newItem);
    addToSearchHistory(newItem);
    setIsHistoryOpen(true);
  }, [addToSearchHistory, setIsHistoryOpen]);

  const handleManualCheck = useCallback(() => {
    triggerManualCheck();
  }, [triggerManualCheck]);

  // استخدام useEffect لتحديث البيانات بشكل دوري
  useEffect(() => {
    // تحديث البيانات كل 5 دقائق
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="analysis">التحليل</TabsTrigger>
          <TabsTrigger value="dashboard">الإحصائيات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-6 animate-fade-in">
          {/* معلومات سريعة */}
          <InfoCard title="معلومات التحليل">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">أنواع التحليل</h4>
                <ul className="space-y-1">
                  {Object.entries(analysisTypeTooltips).slice(0, 5).map(([type, description]) => (
                    <li key={type} className="text-sm">
                      <AnalysisTooltip content={description}>
                        {type}
                      </AnalysisTooltip>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">الأطر الزمنية</h4>
                <ul className="space-y-1">
                  {Object.entries(timeframeTooltips).map(([timeframe, description]) => (
                    <li key={timeframe} className="text-sm">
                      <AnalysisTooltip content={description}>
                        {timeframe}
                      </AnalysisTooltip>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">إحصائيات سريعة</h4>
                {isRefreshing ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ) : (
                  <ul className="space-y-1 text-sm">
                    <li>عدد التحليلات: {analysisStats.total}</li>
                    <li>التحليلات النشطة: {analysisStats.active}</li>
                    <li>التحليلات المكتملة: {analysisStats.completed}</li>
                  </ul>
                )}
              </div>
            </div>
          </InfoCard>

          {/* TradingView Chart */}
          <MemoizedLiveTradingViewChart
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
            <MemoizedChartDisplay
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
          <BacktestCheckButton 
            onCheck={handleManualCheck}
            isLoading={isLoading}
            lastCheckTime={lastCheckTime}
          />
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
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

// استخدام default export للتوافق مع التحميل البطيء
export default ChartAnalyzer;
