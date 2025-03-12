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
  const priceUpdateCountRef = useRef<number>(0);

  useEffect(() => {
    console.log('TradingViewWidget mounted with symbol:', symbol);
    
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
          if (price === null || price === undefined || isNaN(price)) {
            console.warn('Received invalid price from TradingView:', price);
            return;
          }
          
          priceUpdateCountRef.current += 1;
          console.log(`★★★ Price updated from TradingView (${priceUpdateCountRef.current}):`, price, 'for symbol:', symbol);
          
          currentPriceRef.current = price;
          onPriceUpdate?.(price);
          
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { price, symbol }
          }));
          
          console.log('Current price saved in ref:', currentPriceRef.current);
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    const attemptInitialPriceRequest = () => {
      try {
        window.postMessage({ method: 'getCurrentPrice', symbol }, '*');
        console.log('Sent getCurrentPrice request to TradingView via window.postMessage');
      } catch (e) {
        console.warn('Failed to request initial price from TradingView', e);
      }
    };
    
    const initialPriceTimer = setTimeout(attemptInitialPriceRequest, 3000);

    const handleManualCheck = () => {
      console.log('Manual check requested, current price:', currentPriceRef.current);
      const price = currentPriceRef.current;
      if (price !== null) {
        console.log('Executing manual check with price:', price);
        checkActiveAnalysesWithCurrentPrice(price);
      } else {
        console.warn('Manual check requested but current price is null');
        checkActiveAnalysesWithCurrentPrice(null);
      }
    };
    
    window.addEventListener('manual-check-analyses', handleManualCheck);

    const handleRequestCurrentPrice = () => {
      console.log('Current price requested, value:', currentPriceRef.current);
      if (currentPriceRef.current !== null) {
        window.dispatchEvent(new CustomEvent('current-price-response', { 
          detail: { price: currentPriceRef.current, symbol } 
        }));
      } else {
        console.warn('Current price requested but value is null');
        attemptInitialPriceRequest();
      }
    };
    
    window.addEventListener('request-current-price', handleRequestCurrentPrice);

    const checkActiveAnalysesWithCurrentPrice = async (price: number | null) => {
      try {
        console.log('Triggering check for active analyses with current price:', price);
        
        const requestBody: Record<string, any> = { 
          symbol,
          requestedAt: new Date().toISOString()
        };
        
        if (price !== null) {
          requestBody.currentPrice = price;
        }
        
        const { data, error } = await fetch('/functions/v1/auto-check-analyses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Error status: ${response.status} ${response.statusText}`);
          }
          return response.json().then(data => ({ data, error: null }));
        }).catch(error => {
          console.error('Fetch error:', error);
          return { data: null, error };
        });
        
        if (error) {
          console.error('Error checking analyses:', error);
          window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
            detail: { error: String(error) }
          }));
          return;
        }
        
        console.log('Analyses check result:', data);
        
        window.dispatchEvent(new CustomEvent('analyses-checked', { 
          detail: { 
            timestamp: data.timestamp, 
            checkedCount: data.checked, 
            symbol: data.symbol 
          }
        }));
        
        window.dispatchEvent(new CustomEvent('historyUpdated', { 
          detail: { timestamp: data.timestamp }
        }));
      } catch (error) {
        console.error('Failed to check active analyses:', error);
        
        window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
          detail: { error: error instanceof Error ? error.message : String(error) }
        }));
      }
    };

    const autoCheckInterval = setInterval(() => {
      const price = currentPriceRef.current;
      if (price !== null) {
        console.log('Auto check triggered with price:', price);
        checkActiveAnalysesWithCurrentPrice(price);
      } else {
        console.warn('Auto check skipped, current price is null');
        checkActiveAnalysesWithCurrentPrice(null);
      }
    }, 10000);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('manual-check-analyses', handleManualCheck);
      window.removeEventListener('request-current-price', handleRequestCurrentPrice);
      clearInterval(autoCheckInterval);
      clearTimeout(initialPriceTimer);
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
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center">
        {currentPriceRef.current ? 
          `السعر الحالي: ${currentPriceRef.current}` : 
          'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
        }
      </div>
    </div>
  );
}

export default TradingViewWidget;
