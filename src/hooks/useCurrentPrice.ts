
import { useState, useEffect } from 'react';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';
import { UseCurrentPriceResult, MarketData } from '@/hooks/current-price/types';

export const useCurrentPrice = (): UseCurrentPriceResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [marketData, setMarketData] = useState<MarketData | undefined>(undefined);

  useEffect(() => {
    console.log('تم تركيب hook useCurrentPrice');
    
    // استخراج السعر الأولي
    const fetchInitialPrice = async () => {
      console.log('جاري استخراج السعر المبدئي...');
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log('تم الحصول على السعر المبدئي:', price);
        setCurrentPrice(price);
        setPriceUpdateCount(prev => prev + 1);
        
        // تعيين بيانات السوق التقديرية
        updateMarketData(price);
      } else {
        console.log('لم يتم استخراج سعر صالح، سيتم المحاولة مرة أخرى...');
      }
    };
    
    // تحديث بيانات السوق
    const updateMarketData = (price: number) => {
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
    };
    
    // تنفيذ استخراج السعر المبدئي
    fetchInitialPrice();
    
    // جدولة تحديثات دورية
    const updateInterval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null && price !== currentPrice) {
        console.log('تم تحديث السعر في useCurrentPrice:', price);
        setCurrentPrice(price);
        setPriceUpdateCount(prev => prev + 1);
        
        // تحديث بيانات السوق التقديرية
        updateMarketData(price);
      }
    }, 3000);
    
    // استماع لأحداث تحديث السعر من النوافذ الأخرى
    const handlePriceUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ price: number }>;
      if (customEvent.detail?.price && customEvent.detail.price !== currentPrice) {
        console.log('تم استلام تحديث سعر من حدث مخصص:', customEvent.detail.price);
        setCurrentPrice(customEvent.detail.price);
        setPriceUpdateCount(prev => prev + 1);
        
        // تحديث بيانات السوق التقديرية
        updateMarketData(customEvent.detail.price);
      }
    };
    
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    };
  }, [currentPrice]);

  return { currentPrice, priceUpdateCount, marketData };
};
