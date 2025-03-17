
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: string;
  allowSymbolChange?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = 'XAUUSD',
  theme = 'light',
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
      
      // Create the widget container
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      widgetContainer.style.width = '100%';
      widgetContainer.style.height = '100%';
      
      // Create script element for the Single Quote Widget
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
      
      // Set the configuration
      script.innerHTML = JSON.stringify({
        symbol: `CFI:${symbol}`,
        width: "100%",
        colorTheme: theme,
        isTransparent: false,
        locale: "ar"
      });
      
      // Append the script to the widget container
      widgetContainer.appendChild(script);
      
      // Append the widget container to our container
      container.current.appendChild(widgetContainer);
      
      // Setup price extraction
      setTimeout(() => {
        try {
          extractPriceFromWidget();
        } catch (error) {
          console.error('Error extracting price:', error);
        }
      }, 2000);
      
      // Set up interval for price updates
      const priceInterval = setInterval(() => {
        try {
          extractPriceFromWidget();
        } catch (error) {
          console.error('Error extracting price in interval:', error);
        }
      }, 1000);
      
      return () => {
        clearInterval(priceInterval);
      };
    }
  }, [symbol, theme]);
  
  // Function to extract price from the widget
  const extractPriceFromWidget = () => {
    if (!container.current) return;
    
    // Try to find the price element in the Single Quote Widget
    const priceElement = container.current.querySelector('.tv-ticker-tape-price__value');
    
    if (priceElement && priceElement.textContent) {
      const priceText = priceElement.textContent.trim();
      const price = parseFloat(priceText.replace(/[^\d.-]/g, ''));
      
      if (!isNaN(price)) {
        console.log('Extracted price from widget:', price);
        // Dispatch a custom event with the price
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price }
          })
        );
      }
    }
  };

  return (
    <div 
      ref={container} 
      style={{ 
        width: '100%', 
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f9f9f9',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default TradingViewWidget;
