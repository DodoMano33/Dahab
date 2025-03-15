
import { useState, useEffect, useCallback } from 'react';
import { PriceUpdateEvent, CurrentPriceResponseEvent } from './types';

export const usePriceEventHandlers = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

  const handlePriceUpdate = useCallback((event: PriceUpdateEvent) => {
    if (event.detail && event.detail.price) {
      console.log('useCurrentPrice: Price updated to', event.detail.price);
      setCurrentPrice(event.detail.price);
      setPriceUpdateCount(prev => prev + 1);
    }
  }, []);

  const handleCurrentPriceResponse = useCallback((event: CurrentPriceResponseEvent) => {
    if (event.detail && event.detail.price) {
      console.log('useCurrentPrice: Received current price', event.detail.price);
      setCurrentPrice(event.detail.price);
      setPriceUpdateCount(prev => prev + 1);
    }
  }, []);

  const requestCurrentPrice = useCallback(() => {
    window.dispatchEvent(new Event('request-current-price'));
  }, []);

  return {
    currentPrice,
    priceUpdateCount,
    handlePriceUpdate,
    handleCurrentPriceResponse,
    requestCurrentPrice
  };
};
