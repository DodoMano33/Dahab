
import { useState, useEffect } from 'react';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface UseCurrentPriceResult {
  currentPrice: number | null;
  priceUpdateCount: number;
}

export const useCurrentPrice = (): UseCurrentPriceResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

  useEffect(() => {
    // استخراج السعر الأولي
    const fetchInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        setCurrentPrice(price);
        setPriceUpdateCount(prev => prev + 1);
      }
    };
    
    fetchInitialPrice();
    
    // جدولة تحديثات دورية
    const updateInterval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null && price !== currentPrice) {
        setCurrentPrice(price);
        setPriceUpdateCount(prev => prev + 1);
      }
    }, 3000);
    
    return () => {
      clearInterval(updateInterval);
    };
  }, [currentPrice]);

  return { currentPrice, priceUpdateCount };
};
