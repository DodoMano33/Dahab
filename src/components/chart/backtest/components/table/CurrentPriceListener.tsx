
import React, { useEffect, useState } from 'react';

interface CurrentPriceListenerProps {
  children: (currentPrice: number) => React.ReactNode;
}

export const CurrentPriceListener: React.FC<CurrentPriceListenerProps> = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    // Function to extract price from the TradingView widget
    const extractPrice = () => {
      try {
        // Try to find the TradingView price element
        const priceElement = document.querySelector('.tv-ticker-item-last__last');
        if (priceElement) {
          const priceText = priceElement.textContent || '';
          const price = parseFloat(priceText.replace(',', ''));
          if (!isNaN(price)) {
            setCurrentPrice(price);
            console.log('CurrentPriceListener - Gold price:', price);
          } else {
            console.log('CurrentPriceListener - Could not parse price:', priceText);
          }
        } else {
          console.log('CurrentPriceListener - Price element not found, using default value');
          setCurrentPrice(100); // Default value if element not found
        }
      } catch (error) {
        console.error('CurrentPriceListener - Error extracting price:', error);
        setCurrentPrice(100); // Default value on error
      }
    };

    // Initial extraction
    extractPrice();
    
    // Set up interval for periodic updates
    const interval = setInterval(extractPrice, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return <>{children(currentPrice)}</>;
};
