
import { useState, useEffect } from 'react';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';
import { UseCurrentPriceResult, MarketData } from '@/hooks/current-price/types';

export const useCurrentPrice = (): UseCurrentPriceResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [marketData, setMarketData] = useState<MarketData | undefined>(undefined);

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
        
        // تحديث بيانات السوق التقديرية
        setMarketData({
          symbol: "XAUUSD",
          dayLow: Math.round(price * 0.997),
          dayHigh: Math.round(price * 1.003),
          weekLow: Math.round(price * 0.95),
          weekHigh: Math.round(price * 1.05),
          change: -3.785,
          changePercent: -0.13,
          recommendation: "Strong buy"
        });
      }
    }, 3000);
    
    return () => {
      clearInterval(updateInterval);
    };
  }, [currentPrice]);

  return { currentPrice, priceUpdateCount, marketData };
};
