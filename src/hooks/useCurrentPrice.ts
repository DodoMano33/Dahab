
import { useState, useEffect } from 'react';
import { MarketData } from '@/hooks/current-price/types';
import { getLastExtractedPrice } from '@/utils/price/capture/state';

export const useCurrentPrice = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(() => {
    // استخدام آخر سعر محفوظ كقيمة مبدئية إن وجد
    return getLastExtractedPrice();
  });
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [marketData, setMarketData] = useState<MarketData | undefined>(undefined);

  useEffect(() => {
    // الاستماع لأحداث تحديث السعر من TradingView
    const handlePriceUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ price: number }>;
      if (customEvent.detail?.price) {
        console.log('useCurrentPrice: تم استلام تحديث سعر:', customEvent.detail.price);
        setCurrentPrice(customEvent.detail.price);
        setPriceUpdateCount(prev => prev + 1);
        
        // تحديث بيانات السوق
        if (customEvent.detail.price) {
          const price = customEvent.detail.price;
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
      }
    };
    
    // الاستماع لأحداث استجابة السعر الحالي
    const handleCurrentPriceResponse = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.price) {
        console.log('useCurrentPrice: تم استلام استجابة سعر:', customEvent.detail);
        setCurrentPrice(customEvent.detail.price);
        setPriceUpdateCount(prev => prev + 1);
        
        // تحديث بيانات السوق الكاملة إذا كانت متوفرة
        setMarketData({
          symbol: customEvent.detail.symbol,
          dayLow: customEvent.detail.dayLow,
          dayHigh: customEvent.detail.dayHigh,
          weekLow: customEvent.detail.weekLow,
          weekHigh: customEvent.detail.weekHigh,
          change: customEvent.detail.change,
          changePercent: customEvent.detail.changePercent,
          recommendation: customEvent.detail.recommendation
        });
      }
    };
    
    // طلب تحديث السعر عند التهيئة
    window.dispatchEvent(new Event('request-current-price'));
    
    // تسجيل المستمعين
    window.addEventListener('tradingview-price-update', handlePriceUpdate);
    window.addEventListener('current-price-response', handleCurrentPriceResponse);
    
    // تنظيف المستمعين عند إزالة المكوّن
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse);
    };
  }, []);

  return { currentPrice, priceUpdateCount, marketData };
};
