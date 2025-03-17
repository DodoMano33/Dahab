
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface PriceDisplayProps {
  currentPrice: number | null;
  priceUpdateCount: number;
  lastUpdateTime?: Date | null;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  currentPrice, 
  priceUpdateCount,
  lastUpdateTime
}) => {
  return (
    <Card className="mt-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-md border-2 border-slate-200 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">السعر المستخرج:</div>
          <div className="text-xl font-bold">
            {currentPrice !== null ? (
              <span className="flex items-center">
                <span className="text-green-600 dark:text-green-400">{currentPrice.toFixed(2)}</span>
                <span className="text-sm mr-1">دولار</span>
              </span>
            ) : (
              <span className="text-yellow-500">جاري الاستخراج...</span>
            )}
          </div>
        </div>
        {lastUpdateTime && (
          <div className="text-xs text-muted-foreground text-right mt-1">
            آخر تحديث: {formatDistanceToNow(lastUpdateTime, { addSuffix: true, locale: ar })}
          </div>
        )}
        <div className="text-xs text-muted-foreground text-right mt-1">
          تم تحديث السعر {priceUpdateCount} مرة
        </div>
      </CardContent>
    </Card>
  );
};
