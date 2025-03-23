
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TimeframeData {
  name: string;
  دقة_الاتجاه: number;
  معدل_وقف_الخسارة: number;
  التقييم_العام: number;
}

interface TimeframesPerformanceTabProps {
  timeframeData: TimeframeData[];
}

export const TimeframesPerformanceTab: React.FC<TimeframesPerformanceTabProps> = ({ timeframeData }) => {
  return (
    <div className="h-80">
      {timeframeData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timeframeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="دقة_الاتجاه" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="معدل_وقف_الخسارة" 
              stroke="#ff7300" 
            />
            <Line 
              type="monotone" 
              dataKey="التقييم_العام" 
              stroke="#82ca9d" 
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          لا توجد بيانات كافية للأطر الزمنية المختلفة
        </div>
      )}
    </div>
  );
};
