
import { useState, useEffect } from "react";

interface UseCurrentPriceReturn {
  currentPrice: number | null;
  priceUpdateCount: number;
  setCurrentPrice: (price: number) => void;
}

export const useCurrentPrice = (): UseCurrentPriceReturn => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState(0);

  useEffect(() => {
    // Function to handle price update events
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.price === 'number') {
        setCurrentPrice(event.detail.price);
        setPriceUpdateCount(prev => prev + 1);
      }
    };

    // Register event listeners for different price update mechanisms
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('extracted-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('ui-price-update', handlePriceUpdate as EventListener);
    
    // Function to handle price request
    const handlePriceRequest = () => {
      if (currentPrice !== null) {
        window.dispatchEvent(new CustomEvent('current-price-available', {
          detail: { price: currentPrice }
        }));
      }
    };
    
    window.addEventListener('request-current-price', handlePriceRequest);
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('extracted-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('ui-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handlePriceRequest);
    };
  }, [currentPrice]);
  
  // Function to manually set price and trigger event
  const updatePrice = (price: number) => {
    setCurrentPrice(price);
    setPriceUpdateCount(prev => prev + 1);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('ui-price-update', {
      detail: { price }
    }));
  };

  return {
    currentPrice,
    priceUpdateCount,
    setCurrentPrice: updatePrice
  };
};
