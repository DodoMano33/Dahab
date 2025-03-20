
import { useState, useCallback } from 'react';
import { PriceUpdateEvent, CurrentPriceResponseEvent } from './types';

export const usePriceEventHandlers = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

  // تحسين معالج تحديث السعر لتقليل عدد التحديثات
  const handlePriceUpdate = useCallback((event: PriceUpdateEvent) => {
    if (event.detail && event.detail.price) {
      // تجنب التحديثات المتكررة عندما يكون السعر هو نفسه
      if (currentPrice !== event.detail.price) {
        console.log('useCurrentPrice: تم تحديث السعر إلى', event.detail.price);
        setCurrentPrice(event.detail.price);
        setPriceUpdateCount(prev => prev + 1);
      }
    }
  }, [currentPrice]);

  // تحسين معالج استجابة السعر الحالي
  const handleCurrentPriceResponse = useCallback((event: CurrentPriceResponseEvent) => {
    if (event.detail && event.detail.price) {
      // تجنب التحديثات المتكررة
      if (currentPrice !== event.detail.price) {
        console.log('useCurrentPrice: تم استلام السعر الحالي', event.detail.price);
        setCurrentPrice(event.detail.price);
        setPriceUpdateCount(prev => prev + 1);
      }
    }
  }, [currentPrice]);

  // تحسين طلب السعر الحالي ليكون أقل تكرارًا
  const requestCurrentPrice = useCallback(() => {
    // منع الطلبات المتكررة خلال فترة زمنية قصيرة
    if (!currentPrice) {
      console.log('useCurrentPrice: طلب السعر الحالي');
      window.dispatchEvent(new Event('request-current-price'));
    }
  }, [currentPrice]);

  return {
    currentPrice,
    priceUpdateCount,
    handlePriceUpdate,
    handleCurrentPriceResponse,
    requestCurrentPrice,
    setCurrentPrice
  };
};
