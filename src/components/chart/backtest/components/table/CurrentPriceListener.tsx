
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
        // استخراج السعر من عنصر القيمة الرئيسي ذو الخط الأكبر
        const priceElement = document.querySelector('.tv-symbol-price-quote__value');
        if (priceElement) {
          const priceText = priceElement.textContent || '';
          const price = parseFloat(priceText.replace(',', ''));
          if (!isNaN(price)) {
            setCurrentPrice(price);
            console.log('CurrentPriceListener - Gold price:', price);
          } else {
            console.log('CurrentPriceListener - Could not parse price:', priceText);
            
            // محاولة بديلة للعثور على السعر
            const alternativePriceElement = document.querySelector('.tv-ticker-item-last__last');
            if (alternativePriceElement) {
              const alternativePriceText = alternativePriceElement.textContent || '';
              const alternativePrice = parseFloat(alternativePriceText.replace(',', ''));
              if (!isNaN(alternativePrice)) {
                setCurrentPrice(alternativePrice);
                console.log('CurrentPriceListener - Gold price (alternative):', alternativePrice);
              }
            } else {
              console.log('CurrentPriceListener - Alternative price element not found, using default value');
              setCurrentPrice(100); // Default value if element not found
            }
          }
        } else {
          console.log('CurrentPriceListener - Price element not found, trying alternative...');
          
          // محاولة بديلة للعثور على السعر
          const alternativePriceElement = document.querySelector('.tv-ticker-item-last__last');
          if (alternativePriceElement) {
            const alternativePriceText = alternativePriceElement.textContent || '';
            const alternativePrice = parseFloat(alternativePriceText.replace(',', ''));
            if (!isNaN(alternativePrice)) {
              setCurrentPrice(alternativePrice);
              console.log('CurrentPriceListener - Gold price (alternative):', alternativePrice);
            } else {
              console.log('CurrentPriceListener - Could not parse alternative price');
              setCurrentPrice(100); // Default value if parsing fails
            }
          } else {
            console.log('CurrentPriceListener - Alternative price element not found, using default value');
            setCurrentPrice(100); // Default value if element not found
          }
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
