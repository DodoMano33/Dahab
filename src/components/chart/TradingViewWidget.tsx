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
  const currentPriceRef = useRef<number | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

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

    script.innerHTML = JSON.stringify(config);

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

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(script);

    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(widgetContainer);
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data.name === 'symbol-change') {
          console.log('Symbol changed to:', event.data.symbol);
          onSymbolChange?.(event.data.symbol);
        }
        if (event.data.name === 'price-update') {
          const price = event.data.price;
          console.log('Price updated to:', price);
          
          currentPriceRef.current = price;
          onPriceUpdate?.(price);
          
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { price }
          }));
          
          checkActiveAnalysesWithCurrentPrice(price);
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    const handleManualCheck = (event: CustomEvent) => {
      const price = currentPriceRef.current;
      if (price !== null) {
        checkActiveAnalysesWithCurrentPrice(price);
      }
    };
    
    window.addEventListener('manual-check-analyses', handleManualCheck as EventListener);

    const checkActiveAnalysesWithCurrentPrice = async (price: number) => {
      try {
        console.log('Triggering check for active analyses with current price:', price);
        const response = await fetch('/functions/v1/auto-check-analyses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPrice: price }),
        });
        
        if (!response.ok) {
          throw new Error(`Error checking analyses: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Analyses check result:', result);
        
        window.dispatchEvent(new CustomEvent('analyses-checked', { 
          detail: { timestamp: result.timestamp, checkedCount: result.checked }
        }));
      } catch (error) {
        console.error('Failed to check active analyses:', error);
      }
    };

    const autoCheckInterval = setInterval(() => {
      const price = currentPriceRef.current;
      if (price !== null) {
        checkActiveAnalysesWithCurrentPrice(price);
      }
    }, 10000);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('manual-check-analyses', handleManualCheck as EventListener);
      clearInterval(autoCheckInterval);
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

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
