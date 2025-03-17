
import React, { useState, useEffect } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const ExtractedPriceDisplay: React.FC = () => {
  const { currentPrice, priceUpdateCount } = useCurrentPrice();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(true);

  useEffect(() => {
    if (currentPrice !== null) {
      setLastUpdateTime(new Date());
      setIsExtracting(false);
    }
  }, [currentPrice]);

  // طلب السعر الحالي عند تحميل المكون وتكرار الطلب
  useEffect(() => {
    console.log("ExtractedPriceDisplay: طلب السعر الحالي");
    window.dispatchEvent(new Event('request-current-price'));
    
    // إضافة مستمع للتحديثات المستمرة
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
      console.log("ExtractedPriceDisplay: تم إرسال طلب تحديث السعر");
    }, 1000); // طلب تحديث كل ثانية
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="w-full bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-md border-2 border-slate-200 dark:border-slate-700">
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
              <span className="text-yellow-500 flex items-center">
                جاري الاستخراج... <Loader2 className="animate-spin h-4 w-4 mr-2" />
              </span>
            )}
          </div>
        </div>
        
        {lastUpdateTime && (
          <div className="text-xs text-muted-foreground text-right mt-1">
            آخر تحديث: {lastUpdateTime.toLocaleTimeString('ar-SA')}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground text-right mt-1">
          تم تحديث السعر {priceUpdateCount} مرة
        </div>
        
        {isExtracting && (
          <p className="text-center text-amber-500 text-sm mt-2">
            جاري استخراج السعر من الويدجت...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
