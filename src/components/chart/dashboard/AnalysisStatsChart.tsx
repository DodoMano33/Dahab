
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
  display_name?: string;
}

export const AnalysisStatsChart = ({ stats }: { stats: AnalysisStats[] }) => {
  // تهيئة بيانات الرسم البياني
  const chartData = stats
    .filter(stat => stat.display_name) // تصفية البيانات للتأكد من وجود أسماء عرض
    .map(stat => ({
      name: stat.display_name || stat.type,
      نجاح: stat.success,
      فشل: stat.fail,
      نسبة_النجاح: (stat.success + stat.fail) > 0 ? 
        Math.round((stat.success / (stat.success + stat.fail)) * 100) : 0,
      لديه_بيانات: (stat.success + stat.fail) > 0
    }))
    // ترتيب حسب وجود بيانات ثم حسب نسبة النجاح
    .sort((a, b) => {
      if (a.لديه_بيانات && !b.لديه_بيانات) return -1;
      if (!a.لديه_بيانات && b.لديه_بيانات) return 1;
      return b.نسبة_النجاح - a.نسبة_النجاح;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>أداء أنواع التحليل</CardTitle>
        <CardDescription>
          مقارنة بين معدلات نجاح وفشل أنواع التحليل المختلفة ({chartData.length} نوع)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                fontSize={12}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'نسبة_النجاح' ? `${value}%` : value, 
                  name === 'نسبة_النجاح' ? 'نسبة النجاح' : name
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="نجاح" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="فشل" fill="#ff8042" />
              <Bar yAxisId="right" dataKey="نسبة_النجاح" fill="#82ca9d">
                {
                  chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.نسبة_النجاح > 50 ? '#82ca9d' : (entry.نسبة_النجاح > 0 ? '#ff8042' : '#ccc')}
                      fillOpacity={entry.لديه_بيانات ? 1 : 0.5}
                    />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
