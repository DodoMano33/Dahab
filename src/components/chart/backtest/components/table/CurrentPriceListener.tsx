
import React, { useState, useEffect, ReactNode } from "react";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => ReactNode;
}

export const CurrentPriceListener: React.FC<CurrentPriceListenerProps> = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    // Function to handle price update events
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.price === 'number') {
        setCurrentPrice(event.detail.price);
      }
    };

    // Register event listeners for different price update mechanisms
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('extracted-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('ui-price-update', handlePriceUpdate as EventListener);
    
    // Event listener for price request events
    const handlePriceRequest = () => {
      // If we have a current price, dispatch it back
      if (currentPrice !== null) {
        window.dispatchEvent(new CustomEvent('current-price-available', {
          detail: { price: currentPrice }
        }));
      }
    };
    
    window.addEventListener('request-current-price', handlePriceRequest);
    
    // Initially request the current price
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('extracted-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('ui-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handlePriceRequest);
    };
  }, [currentPrice]);

  // Render children with current price
  return <>{children(currentPrice)}</>;
};
