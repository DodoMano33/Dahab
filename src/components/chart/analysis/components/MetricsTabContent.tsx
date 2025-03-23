
import React from 'react';
import { PerformanceMetrics } from '../PerformanceMetrics';

interface MetricsTabContentProps {
  analysisType: string;
}

export const MetricsTabContent: React.FC<MetricsTabContentProps> = ({ analysisType }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        مؤشرات تفصيلية حول أداء نوع التحليل الحالي.
      </p>
      
      <PerformanceMetrics analysisType={analysisType} />
    </div>
  );
};
