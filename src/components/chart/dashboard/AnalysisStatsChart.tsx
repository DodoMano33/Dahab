
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
}

export const AnalysisStatsChart = ({ stats }: { stats: AnalysisStats[] }) => {
  const chartData = stats.map(stat => ({
    name: getStrategyName(stat.type),
    نجاح: stat.success,
    فشل: stat.fail,
    نسبة_النجاح: stat.success > 0 ? 
      Math.round((stat.success / (stat.success + stat.fail)) * 100) : 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>أداء أنواع التحليل</CardTitle>
        <CardDescription>
          مقارنة بين معدلات نجاح وفشل أنواع التحليل المختلفة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={20}
              maxBarSize={25}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                interval={0} 
                tick={{ fontSize: 10 }}
                height={50}
                textAnchor="end"
                angle={-45}
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
                    <Cell key={`cell-${index}`} fill={entry.نسبة_النجاح > 50 ? '#82ca9d' : '#ff8042'} />
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
