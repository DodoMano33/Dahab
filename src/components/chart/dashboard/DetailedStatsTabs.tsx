
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AnalysisStatsChart } from "./AnalysisStatsChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { TimeframePerfChart } from "./TimeframePerfChart";
import { supabase } from "@/lib/supabase";
import { AnalysisStats } from "./types";

interface DetailedStatsTabsProps {
  stats: any[];
  isLoading: boolean;
  setStats: (stats: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function DetailedStatsTabs({ stats, isLoading, setStats, setIsLoading }: DetailedStatsTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleRefresh = () => {
    setIsLoading(true);
    supabase.rpc('get_backtest_stats').then(({ data }) => {
      setStats(data || []);
      setIsLoading(false);
    });
  };

  // Calculate statistics for SuccessRateChart
  const totalSuccess = stats.reduce((acc, curr) => acc + (curr.success || 0), 0);
  const totalFail = stats.reduce((acc, curr) => acc + (curr.fail || 0), 0);
  const totalTests = totalSuccess + totalFail;
  const successRate = totalTests > 0 ? Math.round((totalSuccess / totalTests) * 100) : 0;

  // Prepare data for AnalysisStatsChart
  const analysisData = stats.map(stat => ({
    name: stat.display_name || stat.type,
    success: stat.success || 0,
    fail: stat.fail || 0,
    total: (stat.success || 0) + (stat.fail || 0),
    rate: (stat.success || 0) + (stat.fail || 0) > 0 
      ? Math.round((stat.success || 0) / ((stat.success || 0) + (stat.fail || 0)) * 100) 
      : 0
  }));

  // For the timeframes chart, we'll use the same data for now
  // In a real scenario, this would be replaced with actual timeframe data
  const timeframeData = analysisData;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>الإحصائيات المفصلة</CardTitle>
          <CardDescription>
            تحليل أدائك وإحصائيات النجاح
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 gap-4 w-full">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="types">أنواع التحليل</TabsTrigger>
            <TabsTrigger value="timeframes">الأطر الزمنية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <SuccessRateChart 
              successRate={successRate} 
              totalTests={totalTests} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="types">
            <AnalysisStatsChart 
              data={analysisData} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="timeframes">
            <TimeframePerfChart 
              data={timeframeData} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
