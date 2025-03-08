
import React, { useEffect, useRef, useState } from 'react';
import { cleanSymbolName, isValidPrice, extractPriceFromMessage, extractSymbolFromMessage } from '@/utils/tradingViewUtils';

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
  const lastSymbolRef = useRef<string>(symbol);
  const lastPriceRef = useRef<number | null>(null);

  // Track last values to prevent duplicate updates
  useEffect(() => {
    lastSymbolRef.current = symbol;
  }, [symbol]);

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
    widgetDiv.id = 'tradingview_widget_' + Date.now(); // Unique ID to prevent conflicts
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
      
      // Initial notification of current symbol and price (if available)
      if (onSymbolChange) {
        const cleanedSymbol = cleanSymbolName(symbol);
        console.log("Initial symbol set to:", cleanedSymbol);
        onSymbolChange(cleanedSymbol);
      }
    };

    return () => {
      // Clean up on unmount
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, onSymbolChange]);

  // Set up event listeners for symbol and price updates
  useEffect(() => {
    if (!widgetLoaded) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        // Only process messages with data
        if (!event.data) return;
        
        // Debug log to see all incoming messages
        console.log("TradingView raw message received:", event.data);
        
        // Extract symbol and price from different message formats
        const newSymbol = extractSymbolFromMessage(event.data);
        const newPrice = extractPriceFromMessage(event.data);
        
        // Process symbol change if detected
        if (newSymbol && newSymbol !== lastSymbolRef.current) {
          const cleanedSymbol = cleanSymbolName(newSymbol);
          console.log('Symbol changed to:', cleanedSymbol, '(from:', newSymbol, ')');
          lastSymbolRef.current = newSymbol;
          
          if (onSymbolChange) {
            onSymbolChange(cleanedSymbol);
          }
        }
        
        // Process price update if detected
        if (newPrice !== null && isValidPrice(newPrice) && newPrice !== lastPriceRef.current) {
          console.log('Price updated to:', newPrice);
          lastPriceRef.current = newPrice;
          
          if (onPriceUpdate) {
            onPriceUpdate(newPrice);
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
  }, [widgetLoaded, onSymbolChange, onPriceUpdate]);

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
