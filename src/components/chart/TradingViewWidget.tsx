
import React, { useEffect, useRef } from 'react';

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

    // Clear existing content and append new widget
    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(widgetContainer);
    }

    // Custom event handling for TradingView chart
    const handleCustomEvent = (event: any) => {
      // This handles communication with the TradingView iframe
      if (event.source !== window) {
        try {
          // Extract symbol changes when available
          if (event.data && event.data.name === 'symbolChange') {
            const newSymbol = event.data.data[0].value;
            console.log('TradingView symbol changed to:', newSymbol);
            onSymbolChange?.(newSymbol);
          }
          
          // Extract price updates when available
          if (event.data && event.data.name === 'quoteUpdate') {
            const lastPrice = event.data.data[0]?.last;
            if (lastPrice && !isNaN(Number(lastPrice))) {
              console.log('TradingView price updated to:', lastPrice);
              onPriceUpdate?.(Number(lastPrice));
            }
          }
        } catch (error) {
          console.error('Error handling TradingView message:', error);
        }
      }
    };

    // Listen for all messages from the iframe
    window.addEventListener('message', handleCustomEvent);

    return () => {
      window.removeEventListener('message', handleCustomEvent);
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
    </div>
  );
}

export default TradingViewWidget;
