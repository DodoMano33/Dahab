
import { useEffect, useState, useRef } from 'react';
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
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // الاستماع لتغييرات إعدادات المستخدم
    const handleSettingsUpdate = ((event: CustomEvent) => {
      if (event.detail && event.detail.priceUpdateInterval) {
        setPriceUpdateInterval(event.detail.priceUpdateInterval * 1000);
      }
      if (event.detail && event.detail.apiKey) {
        priceUpdater.setCustomApiKey(event.detail.apiKey);
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
    priceUpdater.subscribe(symbol, handlePriceUpdated);
    
    // إعادة تعيين الفاصل الزمني عند تغيير priceUpdateInterval
    const setupPriceUpdateInterval = () => {
      // إلغاء الفاصل الزمني السابق إذا وجد
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      
      // تعيين فاصل زمني جديد
      intervalRef.current = window.setInterval(() => {
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
    };
    
    // إعداد الفاصل الزمني الأولي
    setupPriceUpdateInterval();
    
    // تنظيف مستمعي الأحداث والاشتراكات عند إزالة المكون
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('user-settings-updated', handleSettingsUpdate);
      
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      
      priceUpdater.unsubscribe(symbol, handlePriceUpdated);
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice, setCurrentPrice, symbol, priceUpdateInterval]);

  return { currentPrice, priceUpdateCount };
};
