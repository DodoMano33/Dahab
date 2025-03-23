
import { useState, useCallback, useEffect } from "react";

export const useTradingViewPrice = () => {
  const [tradingViewPrice, setTradingViewPrice] = useState<number | null>(null);

  const handleTradingViewPriceUpdate = useCallback((event: CustomEvent) => {
    if (event.detail && event.detail.price) {
      setTradingViewPrice(event.detail.price);
      console.log("Received TradingView price update:", event.detail.price);
    }
  }, []);

  const setupTradingViewPriceListener = useCallback(() => {
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    };
  }, [handleTradingViewPriceUpdate]);

  return {
    tradingViewPrice,
    setTradingViewPrice,
    setupTradingViewPriceListener
  };
};
