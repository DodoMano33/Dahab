
import { useMemo } from "react";
import { formatChartLabels } from "./charting/chartUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useCurrentPrice } from "@/hooks/current-price";
import { SearchHistoryItem } from "@/types/analysis";
import { AnalysisChart } from "./charting/AnalysisChart";
import { EmptyChartState } from "./charting/EmptyChartState";

interface AnalysisChartDisplayProps {
  searchHistory: SearchHistoryItem[];
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

export const AnalysisChartDisplay = ({ 
  searchHistory,
  isRefreshing,
  onRefresh
}: AnalysisChartDisplayProps) => {
  const { currentPrice, priceUpdateCount } = useCurrentPrice();
  
  // Filter active analyses (those without a result timestamp)
  const activeAnalyses = useMemo(() => 
    searchHistory.filter(item => !item.result_timestamp),
    [searchHistory]
  );
  
  // Prepare chart labels and data points
  const chartLabels = useMemo(() => 
    formatChartLabels(activeAnalyses),
    [activeAnalyses]
  );
  
  const targetDataPoints = useMemo(() => 
    activeAnalyses.map(item => {
      if (item.analysis?.targets && Array.isArray(item.analysis.targets) && item.analysis.targets.length > 0) {
        return item.analysis.targets[0].price || 0;
      }
      return 0;
    }),
    [activeAnalyses]
  );
  
  const stopLossDataPoints = useMemo(() => 
    activeAnalyses.map(item => item.analysis?.stopLoss || 0),
    [activeAnalyses]
  );

  // Show empty state if no active analyses
  if (activeAnalyses.length === 0) {
    return <EmptyChartState onRefresh={onRefresh} isRefreshing={isRefreshing} />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>مخطط التحليلات النشطة</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium">
              عدد التحليلات: {activeAnalyses.length}
            </Badge>
            <Badge variant="outline" className="font-medium">
              السعر الحالي: {currentPrice?.toFixed(4) || '-'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="targets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="targets">الأهداف الأولى</TabsTrigger>
            <TabsTrigger value="stopLoss">وقف الخسارة</TabsTrigger>
          </TabsList>
          <TabsContent value="targets" className="p-2">
            <AnalysisChart 
              labels={chartLabels}
              dataPoints={targetDataPoints}
              currentPrice={currentPrice}
              isTargets={true}
            />
          </TabsContent>
          <TabsContent value="stopLoss" className="p-2">
            <AnalysisChart 
              labels={chartLabels}
              dataPoints={stopLossDataPoints}
              currentPrice={currentPrice}
              isTargets={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
