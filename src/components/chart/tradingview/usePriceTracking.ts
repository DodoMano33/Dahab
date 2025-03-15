
import { useEffect, useRef } from 'react';
import { usePriceReader } from '@/hooks/usePriceReader';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';

interface UsePriceTrackingProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
}

export const usePriceTracking = ({ 
  symbol, 
  onPriceUpdate 
}: UsePriceTrackingProps) => {
  const currentPriceRef = useRef<number | null>(null);
  const { price: screenPrice } = usePriceReader(500); // تحديث أسرع (500ms)

  // استخدام الفاحص التحليلي
  useAnalysisChecker({
    symbol,
    currentPriceRef
  });

  // تحديث السعر المرجعي عند تغيير السعر المقروء
  useEffect(() => {
    if (screenPrice !== null) {
      currentPriceRef.current = screenPrice;
      console.log('Current price updated in price tracking:', screenPrice);
      
      // إعلام باقي المكونات بالسعر الجديد
      if (onPriceUpdate) {
        onPriceUpdate(screenPrice);
      }
    }
  }, [screenPrice, onPriceUpdate]);

  return {
    currentPriceRef,
    screenPrice
  };
};
