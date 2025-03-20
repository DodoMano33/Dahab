
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
  timeframe?: string;
}

export const TimeframePerfChart = ({ stats }: { stats: AnalysisStats[] }) => {
  // تجميع البيانات حسب الإطار الزمني
  const timeframeData: Record<string, { success: number, fail: number }> = {};
  
  stats.forEach(stat => {
    if (stat.timeframe) {
      if (!timeframeData[stat.timeframe]) {
        timeframeData[stat.timeframe] = { success: 0, fail: 0 };
      }
      timeframeData[stat.timeframe].success += stat.success;
      timeframeData[stat.timeframe].fail += stat.fail;
    }
  });
  
  const chartData = Object.entries(timeframeData).map(([timeframe, data]) => ({
    name: timeframe,
    نجاح: data.success,
    فشل: data.fail,
    نسبة_النجاح: data.success + data.fail > 0 
      ? Math.round((data.success / (data.success + data.fail)) * 100) 
      : 0
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>أداء الأطر الزمنية</CardTitle>
          <CardDescription>
            لا توجد بيانات كافية لإظهار أداء الأطر الزمنية
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>أداء الأطر الزمنية</CardTitle>
        <CardDescription>
          مقارنة نسب النجاح بين الأطر الزمنية المختلفة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'نسبة_النجاح' ? `${value}%` : value, 
                  name === 'نسبة_النجاح' ? 'نسبة النجاح' : name
                ]}
              />
              <Legend />
              <Bar dataKey="نسبة_النجاح" fill="#82ca9d" name="نسبة النجاح (%)" />
              <Bar dataKey="نجاح" fill="#8884d8" />
              <Bar dataKey="فشل" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
