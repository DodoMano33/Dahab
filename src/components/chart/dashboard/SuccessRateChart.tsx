
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
}

export const SuccessRateChart = ({ stats }: { stats: AnalysisStats[] }) => {
  const totalSuccess = stats.reduce((acc, stat) => acc + stat.success, 0);
  const totalFail = stats.reduce((acc, stat) => acc + stat.fail, 0);
  
  const data = [
    { name: 'ناجح', value: totalSuccess, color: '#10b981' },
    { name: 'فاشل', value: totalFail, color: '#ef4444' },
  ];
  
  const successRate = totalSuccess + totalFail > 0 
    ? Math.round((totalSuccess / (totalSuccess + totalFail)) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>معدل النجاح الإجمالي</CardTitle>
        <CardDescription>
          نسبة التحليلات الناجحة من إجمالي التحليلات
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}`, 'عدد التحليلات']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center mt-4">
          <div className="text-3xl font-bold">
            {successRate}%
          </div>
          <div className="text-sm text-muted-foreground">
            معدل النجاح الإجمالي
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
