
import { useEffect, useState } from 'react';
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

  const [priceUpdateInterval, setPriceUpdateInterval] = useState<number>(30000); // القيمة الافتراضية 30 ثانية

  useEffect(() => {
    // الاستماع لتغييرات إعدادات المستخدم
    const handleSettingsUpdate = ((event: CustomEvent) => {
      if (event.detail && event.detail.priceUpdateInterval) {
        setPriceUpdateInterval(event.detail.priceUpdateInterval * 1000);
      }
    }) as EventListener;

    window.addEventListener('user-settings-updated', handleSettingsUpdate);

    // تنظيف مستمعي الأحداث السابقة (إذا وجدت)
    window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // إضافة مستمع لتحديثات السعر المخصصة
    window.addEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    requestCurrentPrice();
    
    // الاشتراك في تحديثات السعر من Alpha Vantage
    const handlePriceUpdated = (price: number) => {
      console.log(`تم تحديث السعر من Alpha Vantage: ${price}`);
      setCurrentPrice(price);
      
      // إطلاق حدث تحديث سعر مخصص لضمان انتشار السعر في التطبيق
      const event = new CustomEvent('alpha-vantage-price-update', {
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
    
    // تحديث السعر بناءً على الفاصل الزمني المحدد من المستخدم
    const priceRefreshInterval = setInterval(() => {
      // إعادة طلب السعر من Alpha Vantage مباشرة
      priceUpdater.fetchPrice(symbol)
        .then(price => {
          if (price !== null) {
            handlePriceUpdated(price);
          }
        })
        .catch(error => {
          console.error('فشل في تحديث السعر:', error);
        });
    }, priceUpdateInterval);
    
    // تنظيف مستمعي الأحداث والاشتراكات عند إزالة المكون
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('user-settings-updated', handleSettingsUpdate);
      clearInterval(priceRefreshInterval);
      priceUpdater.unsubscribe(symbol, handlePriceUpdated);
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice, setCurrentPrice, symbol, priceUpdateInterval]);

  return { currentPrice, priceUpdateCount };
};
