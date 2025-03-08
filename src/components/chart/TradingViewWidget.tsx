
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
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    // Update the currentSymbol state when the prop changes
    setCurrentSymbol(symbol);
  }, [symbol]);

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

    // Dedicated function to update price to ensure we handle all needed transforms
    const updatePrice = (price: number) => {
      if (typeof price === 'number' && !isNaN(price)) {
        console.log('Setting price to:', price);
        setCurrentPrice(price);
        onPriceUpdate?.(price);
      } else {
        console.warn('Invalid price received:', price);
      }
    };

    // Dedicated function to update symbol
    const updateSymbol = (newSymbol: string) => {
      if (typeof newSymbol === 'string' && newSymbol.trim() !== '') {
        console.log('Setting symbol to:', newSymbol);
        setCurrentSymbol(newSymbol);
        onSymbolChange?.(newSymbol);
      } else {
        console.warn('Invalid symbol received:', newSymbol);
      }
    };

    // Add event listeners for symbol and price updates
    const handleMessage = (event: MessageEvent) => {
      try {
        if (!event.data || typeof event.data !== 'object') {
          return;
        }

        const data = event.data;
        console.log('Received TradingView message:', data);
        
        // Handle all possible symbol change event types
        if (
          (data.name === 'tv-symbol-change' && data.symbol) || 
          (data.name === 'symbol-change' && data.symbol) ||
          (data.type === 'symbol-change' && data.symbol)
        ) {
          updateSymbol(data.symbol);
        }
        
        // Handle all possible price update event types
        if (
          (data.name === 'tv-price-update' && data.price !== undefined) || 
          (data.name === 'price-update' && data.price !== undefined) ||
          (data.name === 'quoteUpdate' && data.data && data.data.price !== undefined) ||
          (data.name === 'quotes' && data.price !== undefined) ||
          (data.price !== undefined && typeof data.price === 'number')
        ) {
          const price = data.price !== undefined ? data.price : (data.data && data.data.price);
          updatePrice(price);
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    // Set initial price if available from props
    if (window.TradingView && window.TradingView.widget) {
      try {
        // Fix: Use proper syntax to access TradingView widget
        // Don't call TradingView.widget directly, it's a constructor
        console.log('TradingView widget loaded, attempting to get current price');
        // We'll use message events to get price updates instead of trying to access directly
      } catch (e) {
        console.warn('Could not access TradingView widget:', e);
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  // Format price with proper decimal places based on symbol type
  const formattedPrice = currentPrice !== null 
    ? currentSymbol.includes("GOLD") 
      ? currentPrice.toFixed(2) 
      : currentPrice.toFixed(4)
    : "جاري التحميل...";

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div 
        ref={container}
        style={{ height: "calc(100% - 40px)", width: "100%" }}
        className="pt-0"
      />
      
      {/* Info bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 text-white px-4 py-2 flex justify-between items-center h-10">
        <div className="font-semibold">
          <span className="opacity-70 mr-2">الرمز:</span>
          {currentSymbol}
        </div>
        <div className="flex items-center">
          <span className="opacity-70 ml-2">السعر الحالي:</span>
          <span className={currentPrice !== null ? (currentPrice > 0 ? "text-green-400" : "text-red-400") : ""}>
            {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TradingViewWidget;
