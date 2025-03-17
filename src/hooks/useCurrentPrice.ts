
import { useState, useEffect } from 'react';

export interface MarketData {
  symbol: string;
  dayLow?: number;
  dayHigh?: number;
  weekLow?: number;
  weekHigh?: number;
  change?: number;
  changePercent?: number;
  recommendation?: string;
}

export const useCurrentPrice = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [marketData, setMarketData] = useState<MarketData | undefined>(undefined);

  useEffect(() => {
    // الاستماع فقط لأحداث تحديث السعر
    const handlePriceUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ price: number }>;
      if (customEvent.detail?.price) {
        const newPrice = customEvent.detail.price;
        console.log('useCurrentPrice: تم استلام تحديث سعر:', newPrice);
        
        setCurrentPrice(newPrice);
        setPriceUpdateCount(prev => prev + 1);
        
        // تحديث بيانات السوق
        setMarketData({
          symbol: "XAUUSD",
          dayLow: Math.round(newPrice * 0.997),
          dayHigh: Math.round(newPrice * 1.003),
          weekLow: Math.round(newPrice * 0.95),
          weekHigh: Math.round(newPrice * 1.05),
          change: -3.785,
          changePercent: -0.13,
          recommendation: "Strong buy"
        });
      }
    };
    
    window.addEventListener('price-updated', handlePriceUpdate);
    
    return () => {
      window.removeEventListener('price-updated', handlePriceUpdate);
    };
  }, []);

  return { currentPrice, priceUpdateCount, marketData };
};
