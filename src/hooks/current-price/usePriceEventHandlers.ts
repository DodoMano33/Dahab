
import { useState, useEffect, useCallback, useRef } from 'react';
import { PriceUpdateEvent, CurrentPriceResponseEvent } from './types';

export const usePriceEventHandlers = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [priceSource, setPriceSource] = useState<string>('');
  const lastRequestTimeRef = useRef<number>(0);
  const priceRequestIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // ضمان عدم طلب السعر بشكل متكرر جدًا
  const requestCurrentPrice = useCallback(() => {
    const now = Date.now();
    
    // تنفيذ الطلب فقط إذا مر 2 ثانية على الأقل من آخر طلب
    if (now - lastRequestTimeRef.current > 2000) {
      lastRequestTimeRef.current = now;
      console.log('Requesting current price at', new Date().toISOString());
      window.dispatchEvent(new Event('request-current-price'));
      
      // طلب السعر مرة أخرى بعد 500 مللي ثانية إذا لم يتم استلام رد
      setTimeout(() => {
        if (currentPrice === null) {
          console.log('No price received, trying additional request');
          window.dispatchEvent(new Event('request-current-price'));
        }
      }, 500);
    }
  }, [currentPrice]);

  const handlePriceUpdate = useCallback((event: PriceUpdateEvent) => {
    if (event.detail && event.detail.price) {
      const source = event.detail.source || 'TradingView';
      console.log('usePriceEventHandlers: Price updated to', event.detail.price, 
                 'from', source);
      setCurrentPrice(event.detail.price);
      setPriceSource(source);
      setPriceUpdateCount(prev => prev + 1);
    }
  }, []);

  const handleCurrentPriceResponse = useCallback((event: CurrentPriceResponseEvent) => {
    if (event.detail && event.detail.price) {
      const source = event.detail.source || 'API Response';
      console.log('usePriceEventHandlers: Received current price', event.detail.price,
                 'from', source);
      setCurrentPrice(event.detail.price);
      setPriceSource(source);
      setPriceUpdateCount(prev => prev + 1);
    }
  }, []);

  // إعداد مستمعي الأحداث وجدول طلب السعر
  useEffect(() => {
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('global-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    requestCurrentPrice();
    
    // إعداد جدول لطلب السعر كل 15 ثانية
    priceRequestIntervalRef.current = setInterval(requestCurrentPrice, 15000);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('global-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
      
      if (priceRequestIntervalRef.current) {
        clearInterval(priceRequestIntervalRef.current);
      }
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice]);
  
  // إذا لم يتم استلام السعر بعد 5 ثوانٍ، نزيد محاولات الطلب
  useEffect(() => {
    if (currentPrice === null) {
      const additionalRequestsTimer = setTimeout(() => {
        console.log('No price received after initial mount, trying multiple requests');
        
        // سلسلة من الطلبات بتأخيرات متزايدة
        requestCurrentPrice();
        setTimeout(requestCurrentPrice, 1000);
        setTimeout(requestCurrentPrice, 3000);
        setTimeout(requestCurrentPrice, 6000);
      }, 5000);
      
      return () => clearTimeout(additionalRequestsTimer);
    }
  }, [currentPrice, requestCurrentPrice]);

  return {
    currentPrice,
    priceUpdateCount,
    priceSource,
    handlePriceUpdate,
    handleCurrentPriceResponse,
    requestCurrentPrice
  };
};
