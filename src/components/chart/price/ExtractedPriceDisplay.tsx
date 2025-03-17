
import React, { useState, useEffect } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';

export const ExtractedPriceDisplay: React.FC = () => {
  const { currentPrice, priceUpdateCount } = useCurrentPrice();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  useEffect(() => {
    if (currentPrice !== null) {
      setLastUpdateTime(new Date());
      setIsExtracting(false);
    } else {
      setIsExtracting(true);
    }
  }, [currentPrice]);

  // طلب السعر الحالي عند تحميل المكون
  useEffect(() => {
    window.dispatchEvent(new Event('request-current-price'));
    
    // إضافة مستمع للتحديثات المستمرة
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 1000); // طلب تحديث كل ثانية
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full">
      <PriceDisplay 
        currentPrice={currentPrice} 
        priceUpdateCount={priceUpdateCount}
        lastUpdateTime={lastUpdateTime}
      />
      {isExtracting && (
        <p className="text-center text-amber-500 text-sm mt-1">
          جاري استخراج السعر الحالي من الصورة...
        </p>
      )}
    </div>
  );
};
