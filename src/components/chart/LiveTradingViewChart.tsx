import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
  }
}

interface LiveTradingViewChartProps {
  symbol: string;
  timeframe?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  timeframe = "D",
  onSymbolChange,
  onPriceUpdate
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        window.tvWidget = new window.TradingView.widget({
          "width": "100%",
          "height": 500,
          "symbol": symbol,
          "interval": timeframe,
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "ar",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_chart",
          "studies": [
            { id: "MAExp@tv-basicstudies", inputs: { length: 200 } }
          ],
          "autosize": true,
          "overrides": {
            "mainSeriesProperties.showPriceLine": true
          }
        });

        // Correct way to bind to chart ready event
        window.tvWidget.iframe.addEventListener('load', () => {
          console.log("TradingView chart iframe loaded");
          const widget = window.tvWidget;
          
          // Wait for chart to be ready
          if (widget.chart) {
            const chart = widget.chart();
            
            // Listen for symbol changes
            chart.onSymbolChanged().subscribe(null, (symbolInfo: any) => {
              console.log("Symbol changed to:", symbolInfo.name);
              onSymbolChange?.(symbolInfo.name);
            });

            // Set up price update interval
            const updatePrice = () => {
              const lastBar = chart.getLastBar();
              if (lastBar) {
                const lastPrice = lastBar.close;
                console.log("Current price:", lastPrice);
                onPriceUpdate?.(lastPrice);
              }
            };

            // Update price every 5 seconds
            const priceInterval = setInterval(updatePrice, 5000);
            updatePrice(); // Initial price update

            return () => clearInterval(priceInterval);
          }
        });
      }
    };
    
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        const scriptElement = container.current.querySelector('script');
        if (scriptElement) {
          container.current.removeChild(scriptElement);
        }
      }
      if (window.tvWidget) {
        window.tvWidget.remove();
        delete window.tvWidget;
      }
    };
  }, [symbol, timeframe, onSymbolChange, onPriceUpdate]);

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-lg">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};