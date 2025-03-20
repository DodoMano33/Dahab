
import { useEffect } from 'react';
import { usePriceEventHandlers } from './usePriceEventHandlers';
import { UseCurrentPriceResult } from './types';
import { fetchStoredPrice } from '@/utils/price/api/fetchers';

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
    // إضافة مستمع لتحديثات السعر المخصصة
    window.addEventListener('metal-price-update', handlePriceUpdate as EventListener);
    
    // محاولة جلب السعر المخزن عند التحميل
    const fetchInitialPrice = async () => {
      try {
        const storedPrice = await fetchStoredPrice(symbol);
        if (storedPrice !== null) {
          setCurrentPrice(storedPrice);
        }
      } catch (error) {
        console.error('خطأ في جلب السعر الأولي:', error);
      }
    };
    
    fetchInitialPrice();
    
    // تنظيف مستمعي الأحداث والاشتراكات عند إزالة المكون
    return () => {
      window.removeEventListener('metal-price-update', handlePriceUpdate as EventListener);
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice, setCurrentPrice, symbol]);

  return { currentPrice, priceUpdateCount };
};
