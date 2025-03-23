
import React from 'react';
import { AnalystPerformance } from '../AnalystPerformance';

export const PerformanceTabContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        تتبع ومقارنة أداء مختلف أنواع التحليل بناءً على النتائج السابقة.
      </p>
      
      <AnalystPerformance />
    </div>
  );
};
