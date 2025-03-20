
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeframePerfChartProps } from './types';

export const TimeframePerfChart = ({ data, isLoading }: TimeframePerfChartProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-72 flex items-center justify-center">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // Filter out timeframes with no data
  const filteredData = data.filter(item => item.total > 0).sort((a, b) => b.rate - a.rate);

  if (filteredData.length === 0) {
    return (
      <div className="w-full h-72 flex items-center justify-center text-muted-foreground">
        لا توجد بيانات كافية لعرض الإحصائيات
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-6">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={0} 
                textAnchor="middle" 
                height={50}
                interval={0}
              />
              <YAxis yAxisId="left" orientation="left" label={{ value: 'عدد التحليلات', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'معدل النجاح %', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'rate') return [`${value}%`, 'معدل النجاح'];
                  if (name === 'success') return [value, 'ناجحة'];
                  if (name === 'fail') return [value, 'فاشلة'];
                  return [value, name];
                }}
                labelFormatter={(label) => `الإطار الزمني: ${label}`}
              />
              <Legend 
                payload={[
                  { value: 'ناجحة', type: 'square', color: '#10b981' },
                  { value: 'فاشلة', type: 'square', color: '#f43f5e' },
                  { value: 'معدل النجاح', type: 'line', color: '#f59e0b' }
                ]}
              />
              <Bar yAxisId="left" dataKey="success" name="success" stackId="a" fill="#10b981" />
              <Bar yAxisId="left" dataKey="fail" name="fail" stackId="a" fill="#f43f5e" />
              <Bar yAxisId="right" dataKey="rate" name="rate" fill="#f59e0b">
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.rate > 70 ? '#10b981' : entry.rate > 50 ? '#f59e0b' : '#f43f5e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
