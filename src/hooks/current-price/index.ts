
import { useEffect } from 'react';
import { usePriceEventHandlers } from './usePriceEventHandlers';
import { UseCurrentPriceResult } from './types';

export const useCurrentPrice = (): UseCurrentPriceResult => {
  const {
    currentPrice,
    priceUpdateCount,
    handlePriceUpdate,
    handleCurrentPriceResponse,
    requestCurrentPrice
  } = usePriceEventHandlers();

  useEffect(() => {
    // Set up event listeners for price updates
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // Request the current price when the component mounts
    requestCurrentPrice();
    
    // Set up a refresh interval as a fallback
    const priceRefreshInterval = setInterval(() => {
      requestCurrentPrice();
    }, 30000);
    
    // Clean up event listeners and interval
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
      clearInterval(priceRefreshInterval);
    };
  }, [handlePriceUpdate, handleCurrentPriceResponse, requestCurrentPrice]);

  return { currentPrice, priceUpdateCount };
};
