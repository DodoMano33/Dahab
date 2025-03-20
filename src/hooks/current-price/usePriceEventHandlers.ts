
import { useState, useCallback, useRef } from 'react';
import { PriceUpdateEvent, CurrentPriceResponseEvent } from './types';

export const usePriceEventHandlers = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  // استخدام مرجع لآخر سعر لمنع التحديثات الصغيرة المتكررة
  const lastPriceRef = useRef<number | null>(null);
  // استخدام مرجع للمؤقت للحد من معدل التحديثات
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // تحسين معالج تحديث السعر لتقليل عدد التحديثات بشكل كبير
  const handlePriceUpdate = useCallback((event: PriceUpdateEvent) => {
    if (event.detail && event.detail.price) {
      const newPrice = event.detail.price;
      
      // تجنب التحديثات المتكررة خلال فترة زمنية قصيرة (300 مللي ثانية)
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      
      updateTimerRef.current = setTimeout(() => {
        // تجنب التحديثات المتكررة عندما يكون التغيير في السعر صغيرًا جدًا
        const significantChange = !lastPriceRef.current || 
                                  Math.abs(newPrice - lastPriceRef.current) / lastPriceRef.current > 0.0001;
        
        if (significantChange) {
          console.log('useCurrentPrice: تم تحديث السعر إلى', newPrice);
          setCurrentPrice(newPrice);
          setPriceUpdateCount(prev => prev + 1);
          lastPriceRef.current = newPrice;
        }
      }, 300);
    }
  }, []);

  // تحسين معالج استجابة السعر الحالي
  const handleCurrentPriceResponse = useCallback((event: CurrentPriceResponseEvent) => {
    if (event.detail && event.detail.price) {
      const newPrice = event.detail.price;
      
      // تجنب التحديثات المتكررة خلال فترة زمنية قصيرة (300 مللي ثانية)
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      
      updateTimerRef.current = setTimeout(() => {
        // تجنب التحديثات المتكررة عندما يكون التغيير في السعر صغيرًا جدًا
        const significantChange = !lastPriceRef.current || 
                                  Math.abs(newPrice - lastPriceRef.current) / lastPriceRef.current > 0.0001;
        
        if (significantChange) {
          console.log('useCurrentPrice: تم استلام السعر الحالي', newPrice);
          setCurrentPrice(newPrice);
          setPriceUpdateCount(prev => prev + 1);
          lastPriceRef.current = newPrice;
        }
      }, 300);
    }
  }, []);

  // تحسين طلب السعر الحالي ليكون أقل تكرارًا
  const requestCurrentPrice = useCallback(() => {
    // إذا لم يكن لدينا سعر حالي، أو مضى على آخر تحديث أكثر من 30 ثانية
    const shouldRequest = !currentPrice || 
                         (lastPriceRef.current && 
                          Date.now() - lastPriceRef.current.timestamp > 30000);
    
    if (shouldRequest) {
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
