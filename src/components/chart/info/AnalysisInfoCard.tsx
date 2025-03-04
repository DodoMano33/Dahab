
import { analysisTypeTooltips, timeframeTooltips, AnalysisTooltip } from "@/components/ui/tooltips/AnalysisTooltips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisStatsProps {
  total: number;
  active: number;
  completed: number;
  isRefreshing: boolean;
}

export const AnalysisInfoCard = ({ total, active, completed, isRefreshing }: AnalysisStatsProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">معلومات التحليل</CardTitle>
      </CardHeader>
      <CardContent>
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
                <li>عدد التحليلات: {total}</li>
                <li>التحليلات النشطة: {active}</li>
                <li>التحليلات المكتملة: {completed}</li>
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
