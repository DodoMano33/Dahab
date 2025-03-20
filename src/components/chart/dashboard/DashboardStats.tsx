
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  isLoading: boolean;
  stats: {
    overallRate: number;
    totalSuccess: number;
    totalFail: number;
    bestType: string;
  };
}

export function DashboardStats({ isLoading, stats }: DashboardStatsProps) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>لوحة المعلومات الشخصية</CardTitle>
        <CardDescription>
          نظرة عامة على أدائك وتحليلاتك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">نسبة النجاح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  `${stats.overallRate}%`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  `${stats.totalSuccess + stats.totalFail} تحليل`
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">أفضل نوع تحليل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  stats.bestType || "-"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                بناءً على نسبة النجاح
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">التحليلات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.totalSuccess + stats.totalFail
                )}
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-xs text-green-500">
                  {stats.totalSuccess} ناجح
                </span>
                <span className="text-xs text-red-500">
                  {stats.totalFail} فاشل
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
