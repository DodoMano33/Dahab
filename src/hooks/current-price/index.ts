
import { useEffect } from 'react';
import { usePriceEventHandlers } from './usePriceEventHandlers';
import { UseCurrentPriceResult } from './types';

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
    // إضافة مستمع لتحديثات السعر المخصصة (سيتم تنفيذها مع مصدر السعر الجديد)
    window.addEventListener('metal-price-update', handlePriceUpdate as EventListener);
    
    // تنظيف مستمعي الأحداث والاشتراكات عند إزالة المكون
    return () => {
      window.removeEventListener('metal-price-update', handlePriceUpdate as EventListener);
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice, setCurrentPrice, symbol]);

  return { currentPrice, priceUpdateCount };
};
