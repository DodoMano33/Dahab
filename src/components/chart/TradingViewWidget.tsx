
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

    // Custom script to communicate with TradingView
    const customScript = document.createElement('script');
    customScript.type = 'text/javascript';
    customScript.innerHTML = `
      document.addEventListener('DOMContentLoaded', function() {
        const handleSymbolChange = function(e) {
          if (e.data && e.data.name === 'tv-symbol-change') {
            window.dispatchEvent(new CustomEvent('tvSymbolChange', { detail: e.data.symbol }));
          }
        };
        
        const handlePriceUpdate = function(e) {
          if (e.data && e.data.name === 'tv-price-update') {
            window.dispatchEvent(new CustomEvent('tvPriceUpdate', { detail: e.data.price }));
          }
        };
        
        window.addEventListener('message', handleSymbolChange);
        window.addEventListener('message', handlePriceUpdate);
      });
    `;
    
    document.head.appendChild(customScript);

    // Clear existing content and append new widget
    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(widgetContainer);
      setIsLoading(false);
    }

    // Add event listeners for symbol and price updates
    const handleTVSymbolChange = (event: CustomEvent) => {
      const newSymbol = event.detail;
      console.log('Symbol changed to:', newSymbol);
      if (onSymbolChange && typeof newSymbol === 'string') {
        onSymbolChange(newSymbol);
      }
    };
    
    const handleTVPriceUpdate = (event: CustomEvent) => {
      const price = event.detail;
      console.log('Price updated to:', price);
      if (onPriceUpdate && typeof price === 'number') {
        onPriceUpdate(price);
      }
    };

    // Use window level events to handle widget communication
    window.addEventListener('tvSymbolChange', handleTVSymbolChange as EventListener);
    window.addEventListener('tvPriceUpdate', handleTVPriceUpdate as EventListener);

    // Also track direct messages from TradingView iframe
    const handleDirectMessage = (event: MessageEvent) => {
      try {
        if (event.data && typeof event.data === 'object') {
          if (event.data.name === 'symbol-change' || event.data.name === 'tv-symbol-change') {
            console.log('Symbol changed via direct message:', event.data.symbol);
            onSymbolChange?.(event.data.symbol);
          }
          if (event.data.name === 'price-update' || event.data.name === 'tv-price-update') {
            console.log('Price updated via direct message:', event.data.price);
            onPriceUpdate?.(parseFloat(event.data.price));
          }
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleDirectMessage);

    return () => {
      window.removeEventListener('tvSymbolChange', handleTVSymbolChange as EventListener);
      window.removeEventListener('tvPriceUpdate', handleTVPriceUpdate as EventListener);
      window.removeEventListener('message', handleDirectMessage);
      
      if (document.head.contains(customScript)) {
        document.head.removeChild(customScript);
      }
      
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

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
