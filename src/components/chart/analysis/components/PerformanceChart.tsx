
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { formatPercentage, getRatingClass, calculateProgressValue } from "../utils/performanceUtils";

interface AnalysisPerformance {
  type: string;
  overallScore: number;
  directionAccuracy: number;
  targetHitRate: number;
  stopLossRate: number;
  averageTimeToTarget: number;
  recommendedTimeframes: string[];
  recommendedSymbols: string[];
  weaknesses: string[];
  strengths: string[];
}

interface PerformanceChartProps {
  performances: AnalysisPerformance[];
  selectedCategory: string;
  getDisplayName: (type: string) => string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  performances,
  selectedCategory,
  getDisplayName,
}) => {
  return (
    <div className="space-y-4">
      {performances.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          لا توجد بيانات كافية لعرض تقييم الأداء
        </div>
      ) : (
        performances.map((performance) => (
          <div key={performance.type} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">
                {getDisplayName(performance.type)}
              </span>
              <span className={`font-bold ${getRatingClass(
                selectedCategory === 'stopLossRate' 
                  ? 1 - performance[selectedCategory as keyof AnalysisPerformance] as number
                  : performance[selectedCategory as keyof AnalysisPerformance] as number,
                selectedCategory
              )}`}>
                {selectedCategory === 'stopLossRate'
                  ? formatPercentage(performance.stopLossRate)
                  : selectedCategory === 'averageTimeToTarget'
                    ? performance.averageTimeToTarget.toString()
                    : formatPercentage(performance[selectedCategory as keyof AnalysisPerformance] as number)}
              </span>
            </div>
            <Progress 
              value={calculateProgressValue(performance, selectedCategory)}
              className="h-2"
            />
          </div>
        ))
      )}
    </div>
  );
};
