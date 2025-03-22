
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { SearchHistoryItem } from "@/types/analysis";
import { TargetsChart } from "./charts/TargetsChart";
import { StopLossChart } from "./charts/StopLossChart";
import { EmptyChartState } from "../charting/EmptyChartState";

interface ChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  isRefreshing: boolean;
  refreshHistory: () => Promise<void>;
}

export const ChartDialog = ({
  isOpen,
  onClose,
  history,
  isRefreshing,
  refreshHistory
}: ChartDialogProps) => {
  // فلترة التحليلات النشطة فقط (التي لا تحتوي على result_timestamp)
  const activeAnalyses = history.filter(item => !item.result_timestamp);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-6 overflow-hidden" dir="rtl">
        <Card className="w-full h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>الرسم البياني للأهداف ووقف الخسارة</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshHistory} 
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] overflow-auto">
            {activeAnalyses.length === 0 ? (
              <EmptyChartState onRefresh={refreshHistory} isRefreshing={isRefreshing} />
            ) : (
              <Tabs defaultValue="targets" className="w-full h-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="targets">الأهداف</TabsTrigger>
                  <TabsTrigger value="stopLoss">نقاط وقف الخسارة</TabsTrigger>
                </TabsList>
                
                <TabsContent value="targets" className="h-[500px]">
                  <TargetsChart searchHistory={activeAnalyses} />
                </TabsContent>
                
                <TabsContent value="stopLoss" className="h-[500px]">
                  <StopLossChart searchHistory={activeAnalyses} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
