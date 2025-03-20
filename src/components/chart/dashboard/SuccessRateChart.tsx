
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SuccessRateChartProps } from './types';

export const SuccessRateChart = ({ successRate, totalTests, isLoading }: SuccessRateChartProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-72 flex items-center justify-center">
        <Skeleton className="h-48 w-48 rounded-full" />
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-48 h-48">
            <CircularProgressbar
              value={successRate}
              text={`${successRate}%`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: successRate > 70 ? '#10b981' : successRate > 50 ? '#f59e0b' : '#ef4444',
                textColor: '#64748b',
                trailColor: '#e2e8f0',
              })}
            />
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold mb-2">معدل النجاح الإجمالي</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {totalTests > 0 
                ? `بناءً على ${totalTests} تحليل تم اختبارها تاريخياً`
                : 'لا توجد بيانات كافية بعد'}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-600 text-sm font-medium">ناجحة</p>
                <p className="text-2xl font-bold text-green-700">
                  {Math.round(totalTests * successRate / 100)}
                </p>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-red-600 text-sm font-medium">فاشلة</p>
                <p className="text-2xl font-bold text-red-700">
                  {totalTests - Math.round(totalTests * successRate / 100)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
