import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface LiveTradingViewChartProps {
  symbol: string;
  timeframe?: string;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  timeframe = "D" 
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
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
            { id: "MAExp@tv-basicstudies", inputs: { length: 20 } }
          ],
          "autosize": true,
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
    };
  }, [symbol, timeframe]);

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-lg">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};