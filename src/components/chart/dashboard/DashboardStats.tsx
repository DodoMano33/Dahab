
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisStatsChart } from "./AnalysisStatsChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { TimeframePerfChart } from "./TimeframePerfChart";
import { LivePriceTestCard } from "./LivePriceTestCard";
import { useBacktestStats } from "../backtest/hooks/useBacktestStats";
import { useBestEntryPointResults } from "../backtest/hooks/useBestEntryPointResults";
import { useEffect, useState } from "react";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AnalysisStats } from "./types";

// Define interface for timeframe data
interface TimeframeData {
  success: number;
  fail: number;
}

// Interface for chart data item
interface ChartDataItem {
  name: string;
  success: number;
  fail: number;
  total: number;
  rate: number;
}

export function DashboardStats() {
  const { stats, isLoading: statsLoading, refresh: refreshStats } = useBacktestStats();
  const { results, isLoading: resultsLoading, refresh: refreshResults } = useBestEntryPointResults();
  const [successRate, setSuccessRate] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (stats.length > 0) {
      const totalSuccess = stats.reduce((acc, curr) => acc + curr.success, 0);
      const totalFail = stats.reduce((acc, curr) => acc + curr.fail, 0);
      const total = totalSuccess + totalFail;
      
      setTotalTests(total);
      setSuccessRate(total > 0 ? Math.round((totalSuccess / total) * 100) : 0);
    }
  }, [stats]);

  const analysisData = stats.map(stat => ({
    name: stat.display_name || getStrategyName(stat.type) || stat.type,
    success: stat.success,
    fail: stat.fail,
    total: stat.success + stat.fail,
    rate: stat.success + stat.fail > 0 
      ? Math.round((stat.success / (stat.success + stat.fail)) * 100) 
      : 0
  }));

  // Define result with proper type casting
  const timeframeData = results.reduce((acc: Record<string, TimeframeData>, result) => {
    const timeframe = result.timeframe ? result.timeframe.toString() : 'unknown';
    if (!acc[timeframe]) {
      acc[timeframe] = { success: 0, fail: 0 };
    }
    
    // Safely check and update success/fail counts
    if (result.is_successful === true) {
      acc[timeframe].success += 1;
    } else if (result.is_successful === false) {
      acc[timeframe].fail += 1;
    }
    
    return acc;
  }, {} as Record<string, TimeframeData>);

  // Use explicit typing for the mapped data
  const timeframeChartData: ChartDataItem[] = Object.entries(timeframeData).map(([timeframe, data]) => {
    // Destructure with type assertion
    const { success, fail } = data as TimeframeData;
    return {
      name: timeframe,
      success,
      fail,
      total: success + fail,
      rate: success + fail > 0 
        ? Math.round((success / (success + fail)) * 100) 
        : 0
    };
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshStats(), refreshResults()]);
    setIsRefreshing(false);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>إحصائيات الاختبار التاريخي</CardTitle>
            <CardDescription>
              تحليل أداء استراتيجيات التداول المختلفة بناءً على البيانات التاريخية
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing || statsLoading || resultsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="success-rate">
            <TabsList className="mb-4">
              <TabsTrigger value="success-rate">معدل النجاح</TabsTrigger>
              <TabsTrigger value="analysis-types">أنواع التحليل</TabsTrigger>
              <TabsTrigger value="timeframes">الإطارات الزمنية</TabsTrigger>
            </TabsList>
            <TabsContent value="success-rate">
              <SuccessRateChart 
                successRate={successRate} 
                totalTests={totalTests} 
                isLoading={statsLoading} 
              />
            </TabsContent>
            <TabsContent value="analysis-types">
              <AnalysisStatsChart 
                data={analysisData} 
                isLoading={statsLoading} 
              />
            </TabsContent>
            <TabsContent value="timeframes">
              <TimeframePerfChart 
                data={timeframeChartData} 
                isLoading={resultsLoading} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <LivePriceTestCard />
    </div>
  );
}
