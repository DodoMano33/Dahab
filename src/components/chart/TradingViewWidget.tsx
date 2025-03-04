
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
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const previousSymbolRef = useRef<string>(symbol);

  useEffect(() => {
    // Cleanup function - will be called when component unmounts or before re-rendering
    return () => {
      if (scriptRef.current && container.current?.contains(scriptRef.current)) {
        container.current.removeChild(scriptRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log(`Initializing TradingView widget with symbol: ${symbol}`);
    
    // Clean up any previous widget before creating a new one
    if (container.current) {
      container.current.innerHTML = '';
    }
    
    // Format symbol if needed (ensure proper format for TradingView)
    let formattedSymbol = symbol;
    if (!symbol.includes(':') && !symbol.startsWith('CAPITALCOM:')) {
      // Add default exchange prefix for common symbols
      if (/^[A-Z]{6}$/.test(symbol) && (symbol.includes('USD') || symbol.includes('EUR'))) {
        // Likely forex pair
        formattedSymbol = `FX:${symbol}`;
      } else if (/^BTC|^ETH|^BNB|^XRP|^ADA/.test(symbol)) {
        // Likely crypto
        formattedSymbol = `BINANCE:${symbol}USD`;
      } else {
        // Default to CAPITALCOM for other symbols
        formattedSymbol = `CAPITALCOM:${symbol}`;
      }
    }

    previousSymbolRef.current = formattedSymbol;
    console.log(`Creating TradingView chart with symbol: ${formattedSymbol}`);

    // Create the widget container structure
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

    if (container.current) {
      container.current.appendChild(widgetContainer);
    }

    // Create the script element
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;
    scriptRef.current = script;

    // Create the configuration object
    const config = {
      autosize: true,
      symbol: formattedSymbol,
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
    
    // Add the script to the container
    widgetContainer.appendChild(script);

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
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return (
    <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-lg">
      <div 
        ref={container}
        style={{ height: "100%", width: "100%" }}
        className="tradingview-container"
      />
    </div>
  );
}

export default TradingViewWidget;
