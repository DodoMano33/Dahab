
import { useEffect } from 'react';
import { usePriceEventHandlers } from './usePriceEventHandlers';
import { UseCurrentPriceResult } from './types';
import { priceUpdater } from '@/utils/price/updater';

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
    // تنظيف مستمعي الأحداث السابقة (إذا وجدت)
    window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.removeEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
    window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // إضافة مستمع لتحديثات السعر المخصصة
    window.addEventListener('metal-price-update', handlePriceUpdate as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    requestCurrentPrice();
    
    // الاشتراك في تحديثات السعر من Metal Price API
    const handlePriceUpdated = (price: number) => {
      console.log(`تم تحديث السعر من Metal Price API: ${price}`);
      setCurrentPrice(price);
      
      // إطلاق حدث تحديث سعر مخصص لضمان انتشار السعر في التطبيق
      const event = new CustomEvent('metal-price-update', {
        detail: { price }
      });
      window.dispatchEvent(event);
    };
    
    const handlePriceError = (error: Error) => {
      console.error(`خطأ في تحديث السعر من Metal Price API:`, error);
    };
    
    // الاشتراك في تحديثات السعر
    priceUpdater.subscribe({
      symbol,
      onUpdate: handlePriceUpdated,
      onError: handlePriceError
    });
    
    // تحديث السعر كل 60 ثانية (تم تغييرها من 30000 إلى 60000)
    const priceRefreshInterval = setInterval(() => {
      // إعادة طلب السعر من Metal Price API مباشرة
      priceUpdater.fetchPrice(symbol)
        .then(price => {
          if (price !== null) {
            handlePriceUpdated(price);
          }
        })
        .catch(error => {
          console.error('فشل في تحديث السعر:', error);
        });
    }, 60000); // تم تغييرها من 30000 (30 ثانية) إلى 60000 (دقيقة واحدة)
    
    // تنظيف مستمعي الأحداث والاشتراكات عند إزالة المكون
    return () => {
      window.removeEventListener('metal-price-update', handlePriceUpdate as EventListener);
      clearInterval(priceRefreshInterval);
      priceUpdater.unsubscribe(symbol, handlePriceUpdated);
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice, setCurrentPrice, symbol]);

  return { currentPrice, priceUpdateCount };
};
