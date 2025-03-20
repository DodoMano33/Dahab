
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AnalysisStatsChart } from "./AnalysisStatsChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { TimeframePerfChart } from "./TimeframePerfChart";
import { supabase } from "@/lib/supabase";

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
            <SuccessRateChart stats={stats} />
          </TabsContent>
          
          <TabsContent value="types">
            <AnalysisStatsChart stats={stats} />
          </TabsContent>
          
          <TabsContent value="timeframes">
            <TimeframePerfChart stats={stats} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
