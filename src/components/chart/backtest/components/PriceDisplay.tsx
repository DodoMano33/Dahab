
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PriceDisplayProps {
  currentPrice: number | null;
  priceUpdateCount: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  currentPrice, 
  priceUpdateCount 
}) => {
  return (
    <Card className="mt-2">
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">السعر الحالي:</div>
          <div className="text-lg font-bold">
            {currentPrice !== null ? currentPrice.toFixed(2) : 'غير متاح'}
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-right mt-1">
          تم تحديث السعر {priceUpdateCount} مرة
        </div>
      </CardContent>
    </Card>
  );
};
