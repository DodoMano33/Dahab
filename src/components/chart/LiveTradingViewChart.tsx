import { useEffect, useRef } from 'react';

interface LiveTradingViewChartProps {
  symbol?: string;
  timeframe?: string;
}

export const LiveTradingViewChart = ({ 
  symbol = "XAUUSD",
  timeframe = "D"
}: LiveTradingViewChartProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      "autosize": true,
      "symbol": symbol,
      "interval": timeframe,
      "timezone": "exchange",
      "theme": "light",
      "style": "1",
      "locale": "ar",
      "enable_publishing": false,
      "hide_top_toolbar": true,
      "allow_symbol_change": true,
      "save_image": false,
      "calendar": false,
      "hide_volume": true,
      "support_host": "https://www.tradingview.com"
    };

    script.innerHTML = JSON.stringify(config);
    
    // Clean up previous content
    if (container.current.hasChildNodes()) {
      container.current.innerHTML = '';
    }

    // Create new widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    container.current.appendChild(widgetContainer);
    widgetContainer.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, timeframe]);

  return (
    <div ref={container} className="w-full h-full" />
  );
};