
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart3, Target, AlertTriangle } from 'lucide-react';

interface OverallPerformanceTabProps {
  performance: {
    directionAccuracy: number;
    targetHitRate: number;
    stopLossRate: number;
    overallScore: number;
  };
}

export const OverallPerformanceTab: React.FC<OverallPerformanceTabProps> = ({ performance }) => {
  // بيانات الأداء العام
  const overallData = [
    {
      name: 'دقة الاتجاه',
      قيمة: Math.round(performance.directionAccuracy * 100),
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      name: 'تحقيق الأهداف',
      قيمة: Math.round(performance.targetHitRate * 100),
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'تجنب وقف الخسارة',
      قيمة: Math.round((1 - performance.stopLossRate) * 100),
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      name: 'التقييم العام',
      قيمة: Math.round(performance.overallScore * 100),
      icon: <BarChart3 className="h-4 w-4" />
    }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={overallData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="%" />
          <Tooltip formatter={(value) => [`${value}%`, ""]} />
          <Bar 
            dataKey="قيمة" 
            fill="#8884d8" 
            name="النسبة المئوية" 
            label={{ position: 'top', formatter: (value) => `${value}%` }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
