
import React, { useState, useEffect } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';

export const ExtractedPriceDisplay: React.FC = () => {
  const { currentPrice, priceUpdateCount } = useCurrentPrice();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (currentPrice !== null) {
      setLastUpdateTime(new Date());
    }
  }, [currentPrice]);

  // طلب السعر الحالي عند تحميل المكون
  useEffect(() => {
    window.dispatchEvent(new Event('request-current-price'));
  }, []);

  return (
    <div className="w-full">
      <PriceDisplay 
        currentPrice={currentPrice} 
        priceUpdateCount={priceUpdateCount}
        lastUpdateTime={lastUpdateTime}
      />
    </div>
  );
};
