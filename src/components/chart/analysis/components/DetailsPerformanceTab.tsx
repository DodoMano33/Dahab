
import React from 'react';

interface DetailsPerformanceTabProps {
  performance: {
    strengths: string[];
    weaknesses: string[];
    recommendedTimeframes: string[];
    recommendedSymbols: string[];
  };
}

export const DetailsPerformanceTab: React.FC<DetailsPerformanceTabProps> = ({ performance }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">نقاط القوة</h3>
        {performance.strengths.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {performance.strengths.map((strength: string, index: number) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">لم يتم تحديد نقاط قوة بعد</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">نقاط الضعف</h3>
        {performance.weaknesses.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {performance.weaknesses.map((weakness: string, index: number) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">لم يتم تحديد نقاط ضعف بعد</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">الأطر الزمنية الموصى بها</h3>
        {performance.recommendedTimeframes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {performance.recommendedTimeframes.map((tf: string, index: number) => (
              <div key={index} className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm">
                {tf}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">لم يتم تحديد أطر زمنية موصى بها بعد</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">الرموز الموصى بها</h3>
        {performance.recommendedSymbols.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {performance.recommendedSymbols.map((symbol: string, index: number) => (
              <div key={index} className="px-3 py-1 bg-secondary/10 rounded-full text-secondary text-sm">
                {symbol}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">لم يتم تحديد رموز موصى بها بعد</p>
        )}
      </div>
    </div>
  );
};
