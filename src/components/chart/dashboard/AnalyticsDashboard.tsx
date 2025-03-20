
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useBacktestStats } from "@/components/chart/backtest/hooks/useBacktestStats";
import { AnalysisStatsChart } from "./AnalysisStatsChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { TimeframePerfChart } from "./TimeframePerfChart";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function AnalyticsDashboard() {
  const { stats, isLoading, refresh } = useBacktestStats();
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  
  const overallSuccessRate = stats.length > 0
    ? Math.round(
        (stats.reduce((acc, stat) => acc + stat.success, 0) / 
        stats.reduce((acc, stat) => acc + stat.success + stat.fail, 0)) * 100
      )
    : 0;
    
  const bestAnalysisType = stats.length > 0
    ? stats.reduce((prev, current) => {
        const prevRate = prev.success / (prev.success + prev.fail) || 0;
        const currentRate = current.success / (current.success + current.fail) || 0;
        return currentRate > prevRate ? current : prev;
      }).type
    : '';
    
  const totalAnalyses = stats.reduce((acc, stat) => acc + stat.success + stat.fail, 0);

  // Prepare data for charts
  const analysisData = stats.map(stat => ({
    name: stat.display_name || stat.type,
    success: stat.success,
    fail: stat.fail,
    total: stat.success + stat.fail,
    rate: (stat.success + stat.fail) > 0 
      ? Math.round((stat.success / (stat.success + stat.fail)) * 100) 
      : 0
  }));

  // Using the same data for timeframes as we don't have specific timeframe data
  const timeframeData = analysisData;

  if (!user) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>لوحة الإحصائيات</CardTitle>
          <CardDescription>
            يرجى تسجيل الدخول لعرض إحصائيات التحليلات الخاصة بك
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>لوحة الإحصائيات</CardTitle>
          <CardDescription>
            تحليل أداء تحليلاتك وإحصائيات النجاح
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={refresh} 
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">نسبة النجاح الإجمالية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallSuccessRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    استناداً إلى {totalAnalyses} تحليل
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">أفضل نوع تحليل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{bestAnalysisType || "-"}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    بناءً على نسبة النجاح
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">إجمالي التحليلات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnalyses}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-green-500">
                      {stats.reduce((acc, stat) => acc + stat.success, 0)} ناجح
                    </Badge>
                    <Badge variant="outline" className="text-red-500">
                      {stats.reduce((acc, stat) => acc + stat.fail, 0)} فاشل
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <SuccessRateChart 
              successRate={overallSuccessRate}
              totalTests={totalAnalyses}
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
