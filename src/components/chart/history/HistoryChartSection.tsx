
import { useState } from "react";
import { SearchHistoryItem } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart2, LineChart } from "lucide-react";
import { TargetsChart } from "./charts/TargetsChart";
import { StopLossChart } from "./charts/StopLossChart";
import { EmptyChartState } from "../charting/EmptyChartState";

interface HistoryChartSectionProps {
  searchHistory: SearchHistoryItem[];
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

export const HistoryChartSection = ({ 
  searchHistory, 
  isRefreshing, 
  onRefresh 
}: HistoryChartSectionProps) => {
  const [activeTab, setActiveTab] = useState<"targets" | "stopLoss">("targets");
  
  // Filter for active analyses only
  const activeAnalyses = searchHistory.filter(item => !item.result_timestamp);
  
  // If no active analyses, show empty state
  if (activeAnalyses.length === 0) {
    return <EmptyChartState onRefresh={onRefresh} isRefreshing={isRefreshing} />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>مخطط التحليلات</CardTitle>
          <div className="flex items-center gap-2">
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
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "targets" | "stopLoss")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="targets" className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              <span>الأهداف</span>
            </TabsTrigger>
            <TabsTrigger value="stopLoss" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" />
              <span>نقاط وقف الخسارة</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="targets" className="mt-0">
            <TargetsChart searchHistory={activeAnalyses} />
          </TabsContent>
          
          <TabsContent value="stopLoss" className="mt-0">
            <StopLossChart searchHistory={activeAnalyses} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
