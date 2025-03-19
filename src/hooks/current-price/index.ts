
import { useEffect } from 'react';
import { usePriceEventHandlers } from './usePriceEventHandlers';
import { UseCurrentPriceResult } from './types';
import { priceUpdater } from '@/utils/priceUpdater';

export const useCurrentPrice = (symbol: string = 'XAUUSD'): UseCurrentPriceResult => {
  const {
    currentPrice,
    priceUpdateCount,
    handlePriceUpdate,
    handleCurrentPriceResponse,
    requestCurrentPrice,
    setCurrentPrice
  } = usePriceEventHandlers();

  useEffect(() => {
    // الاستماع لتحديثات السعر من TradingView
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    requestCurrentPrice();
    
    // الاشتراك في تحديثات السعر من Alpha Vantage
    const handlePriceUpdated = (price: number) => {
      console.log(`تم تحديث السعر من Alpha Vantage: ${price}`);
      setCurrentPrice(price);
      
      // إطلاق حدث تحديث سعر TradingView لضمان انتشار السعر في التطبيق
      const event = new CustomEvent('tradingview-price-update', {
        detail: { price }
      });
      window.dispatchEvent(event);
    };
    
    const handlePriceError = (error: Error) => {
      console.error(`خطأ في تحديث السعر من Alpha Vantage:`, error);
    };
    
    // الاشتراك في تحديثات السعر
    priceUpdater.subscribe({
      symbol,
      onUpdate: handlePriceUpdated,
      onError: handlePriceError
    });
    
    // تحديث السعر كل 30 ثانية كآلية احتياطية
    const priceRefreshInterval = setInterval(() => {
      requestCurrentPrice();
    }, 30000);
    
    // تنظيف مستمعي الأحداث والاشتراكات عند إزالة المكون
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
      clearInterval(priceRefreshInterval);
      priceUpdater.unsubscribe(symbol, handlePriceUpdated);
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice, setCurrentPrice, symbol]);

  return { currentPrice, priceUpdateCount };
};
