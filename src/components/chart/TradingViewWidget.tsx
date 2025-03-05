
import React, { useEffect, useRef, useState } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

function TradingViewWidget({ 
  symbol = "CAPITALCOM:GOLD",
  onSymbolChange,
  onPriceUpdate 
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("TradingViewWidget: Initializing with symbol", symbol);
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

    // Create the configuration object
    const config = {
      autosize: true,
      symbol: symbol,
      interval: "1",
      timezone: "Asia/Jerusalem",
      theme: "dark",
      style: "1",
      locale: "en",
      hide_legend: true,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      hide_volume: true,
      support_host: "https://www.tradingview.com"
    };

    // Set the script content
    script.innerHTML = JSON.stringify(config);

    // Create widget container structure
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';

    // Append elements in the correct order
    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(script);

    // Setup communication with TradingView
    const setupTradingViewCommunication = () => {
      // This will run once the TradingView widget is fully loaded
      window._tvCommunicationSetup = true;
      
      // Listen for symbol change events from the widget iframe
      window.addEventListener('message', (event) => {
        try {
          if (typeof event.data === 'string') {
            try {
              const data = JSON.parse(event.data);
              if (data && data.name === 'tv-symbol-change') {
                console.log('TradingView symbol changed to:', data.symbol);
                onSymbolChange?.(data.symbol);
              }
              if (data && data.name === 'tv-price-update') {
                console.log('TradingView price updated to:', data.price);
                if (typeof data.price === 'number' && !isNaN(data.price)) {
                  onPriceUpdate?.(data.price);
                }
              }
            } catch (err) {
              // Not JSON data or other parsing error
            }
          } else if (event.data && typeof event.data === 'object') {
            if (event.data.name === 'tv-symbol-change') {
              console.log('Symbol changed via object message:', event.data.symbol);
              onSymbolChange?.(event.data.symbol);
            }
            if (event.data.name === 'tv-price-update') {
              console.log('Price updated via object message:', event.data.price);
              if (typeof event.data.price === 'number' && !isNaN(event.data.price)) {
                onPriceUpdate?.(event.data.price);
              }
            }
          }
        } catch (error) {
          console.error('Error handling TradingView message:', error);
        }
      });
      
      // Extract current price and symbol from TradingView periodically
      const extractInterval = setInterval(() => {
        try {
          const tradingViewFrame = document.querySelector('iframe[src*="tradingview.com"]');
          if (tradingViewFrame) {
            // Try to access the current symbol and price
            tradingViewFrame.contentWindow?.postMessage({
              name: 'get-current-symbol-and-price'
            }, '*');
          }
        } catch (error) {
          console.error('Error extracting data from TradingView:', error);
        }
      }, 1000);

      return extractInterval;
    };

    // Add the custom script to communicate with TradingView
    const customScript = document.createElement('script');
    customScript.type = 'text/javascript';
    customScript.innerHTML = `
      window._tvCommunicationSetup = false;
      document.addEventListener('DOMContentLoaded', function() {
        if (!window._tvCommunicationSetup) {
          window.dispatchEvent(new CustomEvent('tradingViewReady'));
        }
      });
    `;
    document.head.appendChild(customScript);

    // Clear existing content and append new widget
    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(widgetContainer);
      
      // Wait for widget to load
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    // Set up event listeners and communication
    let extractInterval: number | null = null;
    const readyHandler = () => {
      extractInterval = setupTradingViewCommunication();
    };
    
    window.addEventListener('tradingViewReady', readyHandler);
    
    // Manually trigger ready event if TradingView is already loaded
    if (document.querySelector('iframe[src*="tradingview.com"]')) {
      window.dispatchEvent(new CustomEvent('tradingViewReady'));
    }

    // Cleanup function
    return () => {
      window.removeEventListener('tradingViewReady', readyHandler);
      if (extractInterval) clearInterval(extractInterval);
      
      if (document.head.contains(customScript)) {
        document.head.removeChild(customScript);
      }
      
      // Cleanup any leftover event listeners to prevent memory leaks
      window.removeEventListener('message', () => {});
      
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  // Inject a periodic price updater
  useEffect(() => {
    // After widget is loaded, periodically get the current price
    if (!isLoading) {
      const priceUpdateInterval = setInterval(() => {
        try {
          // Find the price display element in the TradingView chart
          const priceElements = document.querySelectorAll('.chart-markup-table.pane');
          if (priceElements.length > 0) {
            const priceText = priceElements[0].textContent;
            if (priceText) {
              // Extract numeric price from text
              const priceMatch = priceText.match(/\d+\.\d+/);
              if (priceMatch && priceMatch[0]) {
                const price = parseFloat(priceMatch[0]);
                if (!isNaN(price) && onPriceUpdate) {
                  console.log('Extracted current price:', price);
                  onPriceUpdate(price);
                }
              }
            }
          }
          
          // Alternative method: check the last price from the status line
          const statusLine = document.querySelector('.status-line');
          if (statusLine) {
            const statusText = statusLine.textContent;
            if (statusText) {
              const priceMatch = statusText.match(/\d+\.\d+/);
              if (priceMatch && priceMatch[0]) {
                const price = parseFloat(priceMatch[0]);
                if (!isNaN(price) && onPriceUpdate) {
                  console.log('Extracted price from status:', price);
                  onPriceUpdate(price);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error in price extraction:', error);
        }
      }, 3000);
      
      return () => clearInterval(priceUpdateInterval);
    }
  }, [isLoading, onPriceUpdate]);

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div 
        ref={container}
        style={{ height: "100%", width: "100%" }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-white text-lg">جاري تحميل الرسم البياني...</div>
        </div>
      )}
    </div>
  );
}

export default TradingViewWidget;
