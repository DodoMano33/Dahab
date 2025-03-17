
import React, { useEffect, useRef } from 'react';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if any
    containerRef.current.innerHTML = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';

    // Create script for Single Quote Widget
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    
    // Widget configuration
    script.innerHTML = JSON.stringify({
      symbol: "CFI:XAUUSD",
      width: "100%",
      colorTheme: "light",
      isTransparent: false,
      locale: "ar"
    });

    // Append elements
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

  }, [symbol]);

  return (
    <div className="w-full mb-6">
      <div className="p-1 bg-gray-800 rounded-lg h-64 flex items-center justify-center">
        <div ref={containerRef} className="w-full h-full">
          {/* TradingView Widget will be inserted here */}
        </div>
      </div>
    </div>
  );
};
