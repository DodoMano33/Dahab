
import React, { useEffect, useRef, useState } from 'react';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if any
    containerRef.current.innerHTML = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';

    // Create script for Advanced Chart Widget (استخدام ويدجت الرسم البياني المتقدم بدلاً من الاقتباس الفردي)
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    
    // Widget configuration
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": "FX:XAUUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "ar",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "hide_top_toolbar": false,
      "allow_symbol_change": true,
      "calendar": false,
      "studies": [
        "MACD@tv-basicstudies"
      ],
      "support_host": "https://www.tradingview.com"
    });

    // Append elements
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    // Function to extract price from widget
    const extractPriceInterval = setInterval(() => {
      try {
        if (containerRef.current) {
          // Try to find the price element with large font in the widget
          const priceElements = containerRef.current.querySelectorAll('.tv-symbol-price-quote__value, .tv-ticker-item-last__last');
          
          for (const element of priceElements) {
            const priceText = element.textContent || '';
            const price = parseFloat(priceText.replace(',', ''));
            
            if (!isNaN(price)) {
              setCurrentPrice(price);
              console.log('Gold price extracted from widget:', price);
              
              // Emit symbol change if callback exists
              if (onSymbolChange) {
                onSymbolChange(symbol);
              }
              
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error extracting price from widget:', error);
      }
    }, 2000); // Check every 2 seconds

    return () => {
      clearInterval(extractPriceInterval);
    };
  }, [symbol, onSymbolChange]);

  return (
    <div className="w-full mb-6">
      <div className="p-1 bg-gray-800 rounded-lg h-64 flex flex-col">
        <div ref={containerRef} className="w-full h-full">
          {/* TradingView Widget will be inserted here */}
        </div>
        {currentPrice && (
          <div className="text-center p-2 bg-white rounded-b-lg">
            <p className="text-lg font-bold text-green-600">
              سعر الذهب الحالي: {currentPrice.toFixed(2)} دولار
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
