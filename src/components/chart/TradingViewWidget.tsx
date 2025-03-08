
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
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Clean up any existing widget to prevent duplicates
    if (container.current) {
      container.current.innerHTML = '';
    }

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

    // Create the script element
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
    
    // Save script reference to prevent duplicates
    scriptRef.current = script;
    
    // Append the script to the widget container
    widgetContainer.appendChild(script);

    // Clear existing content and append new widget
    if (container.current) {
      container.current.appendChild(widgetContainer);
    }

    // Mark widget as loaded
    script.onload = () => {
      console.log("TradingView widget script loaded successfully");
      setWidgetLoaded(true);
    };

    return () => {
      // Clean up on unmount
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  // Set up event listeners for symbol and price updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        // Log all incoming messages for debugging
        console.log("TradingView message received:", event.data);
        
        // Handle symbol change messages
        if (event.data && typeof event.data === 'object') {
          // Check various formats that TradingView might use
          
          // Format 1: Direct symbol change message
          if (event.data.name === 'symbol-change' && event.data.symbol) {
            console.log('Symbol changed to:', event.data.symbol);
            onSymbolChange?.(event.data.symbol);
          }
          
          // Format 2: Symbol in a nested property
          else if (event.data.symbolInfo && event.data.symbolInfo.name) {
            console.log('Symbol changed to (from symbolInfo):', event.data.symbolInfo.name);
            onSymbolChange?.(event.data.symbolInfo.name);
          }
          
          // Format 3: Symbol in the 'symbol' property
          else if (event.data.symbol && typeof event.data.symbol === 'string') {
            console.log('Symbol changed to (from symbol property):', event.data.symbol);
            onSymbolChange?.(event.data.symbol);
          }
          
          // Handle price update messages
          
          // Format 1: Direct price update
          if (event.data.name === 'price-update' && typeof event.data.price === 'number') {
            console.log('Price updated to:', event.data.price);
            onPriceUpdate?.(event.data.price);
          }
          
          // Format 2: Price in the 'price' property
          else if (typeof event.data.price === 'number') {
            console.log('Price updated to (from price property):', event.data.price);
            onPriceUpdate?.(event.data.price);
          }
          
          // Format 3: Price in 'last_price' property
          else if (typeof event.data.last_price === 'number') {
            console.log('Price updated to (from last_price):', event.data.last_price);
            onPriceUpdate?.(event.data.last_price);
          }
          
          // Format 4: Price in 'close' property
          else if (typeof event.data.close === 'number') {
            console.log('Price updated to (from close):', event.data.close);
            onPriceUpdate?.(event.data.close);
          }
          
          // Format 5: Price in a nested structure
          else if (event.data.symbolInfo && typeof event.data.symbolInfo.price === 'number') {
            console.log('Price updated to (from symbolInfo.price):', event.data.symbolInfo.price);
            onPriceUpdate?.(event.data.symbolInfo.price);
          }
          
          // Format 6: Price in a nested last property
          else if (event.data.symbolInfo && typeof event.data.symbolInfo.last === 'number') {
            console.log('Price updated to (from symbolInfo.last):', event.data.symbolInfo.last);
            onPriceUpdate?.(event.data.symbolInfo.last);
          }
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    // Add event listener for messages
    window.addEventListener('message', handleMessage);

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener('message', handleMessage);
    };
  }, [onSymbolChange, onPriceUpdate]);

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
