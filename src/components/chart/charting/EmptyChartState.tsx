
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface EmptyChartStateProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const EmptyChartState = ({ onRefresh, isRefreshing }: EmptyChartStateProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>مخطط التحليلات</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          لا توجد تحليلات نشطة لعرضها في المخطط
        </div>
      </CardContent>
    </Card>
  );
};
