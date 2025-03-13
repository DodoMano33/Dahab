
import { useState, useEffect, useCallback, useRef } from 'react';
import { PriceUpdateEvent, CurrentPriceResponseEvent } from './types';

// القيم المنطقية لسعر الذهب (XAUUSD)
const MIN_VALID_GOLD_PRICE = 500;   // أقل سعر منطقي للذهب (بالدولار)
const MAX_VALID_GOLD_PRICE = 5000;  // أعلى سعر منطقي للذهب (بالدولار)

// التحقق من أن السعر في النطاق المنطقي
const isValidGoldPrice = (price: number): boolean => {
  return !isNaN(price) && price >= MIN_VALID_GOLD_PRICE && price <= MAX_VALID_GOLD_PRICE;
};

export const usePriceEventHandlers = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [priceSource, setPriceSource] = useState<string>('');
  const lastRequestTimeRef = useRef<number>(0);
  const priceRequestIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const requestCurrentPrice = useCallback(() => {
    const now = Date.now();
    
    if (now - lastRequestTimeRef.current > 2000) {
      lastRequestTimeRef.current = now;
      console.log('Requesting current price at', new Date().toISOString());
      window.dispatchEvent(new Event('request-current-price'));
      
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
      // التحقق من صحة السعر قبل قبوله
      const price = Number(event.detail.price);
      if (!isValidGoldPrice(price)) {
        console.warn('Received invalid price update:', price);
        return;
      }
      
      const source = event.detail.source || 'TradingView';
      console.log('usePriceEventHandlers: Price updated to', price, 
                 'from', source);
      setCurrentPrice(price);
      setPriceSource(source);
      setPriceUpdateCount(prev => prev + 1);
    }
  }, []);

  const handleCurrentPriceResponse = useCallback((event: CurrentPriceResponseEvent) => {
    if (event.detail && event.detail.price) {
      // التحقق من صحة السعر قبل قبوله
      const price = Number(event.detail.price);
      if (!isValidGoldPrice(price)) {
        console.warn('Received invalid price response:', price);
        return;
      }
      
      const source = event.detail.source || 'API Response';
      console.log('usePriceEventHandlers: Received current price', price,
                 'from', source);
      setCurrentPrice(price);
      setPriceSource(source);
      setPriceUpdateCount(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('global-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    window.addEventListener('dom-extracted-price', handlePriceUpdate as EventListener);
    
    requestCurrentPrice();
    
    priceRequestIntervalRef.current = setInterval(requestCurrentPrice, 15000);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('global-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
      window.removeEventListener('dom-extracted-price', handlePriceUpdate as EventListener);
      
      if (priceRequestIntervalRef.current) {
        clearInterval(priceRequestIntervalRef.current);
      }
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice]);
  
  useEffect(() => {
    if (currentPrice === null) {
      const additionalRequestsTimer = setTimeout(() => {
        console.log('No price received after initial mount, trying multiple requests');
        
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
