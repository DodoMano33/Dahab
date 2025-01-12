import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

function TradingViewWidget({ 
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate 
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "ar",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com",
        "hide_side_toolbar": false,
        "enable_publishing": false,
        "save_image": true,
        "container_id": "tradingview_chart"
      }`;

    // تنظيف المكون قبل إضافة السكريبت الجديد
    container.current.innerHTML = '';
    container.current.appendChild(script);

    // إضافة مستمع للتغييرات في الرمز والسعر
    const handleMessage = (event: MessageEvent) => {
      if (event.data.name === 'symbol-change') {
        onSymbolChange?.(event.data.symbol);
      }
      if (event.data.name === 'price-update') {
        onPriceUpdate?.(event.data.price);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg">
      <div 
        className="tradingview-widget-container" 
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div 
          className="tradingview-widget-container__widget" 
          style={{ height: "calc(100% - 32px)", width: "100%" }}
        />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);