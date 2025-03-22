
import React, { useEffect, useRef } from 'react';
import { useTradingViewMessages } from '@/hooks/useTradingViewMessages';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';

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
  const lastPriceRef = useRef<number | null>(null);

  const { currentPrice } = useTradingViewMessages({
    symbol,
    onSymbolChange,
    onPriceUpdate
  });

  // Update the currentPriceRef when currentPrice changes
  useEffect(() => {
    if (currentPrice !== null && !isNaN(currentPrice)) {
      currentPriceRef.current = currentPrice;
      console.log('Updated currentPriceRef to:', currentPrice);
      
      // تحقق مما إذا كان السعر قد تغير فعليًا
      if (lastPriceRef.current !== currentPrice) {
        // انشر حدث تحديث السعر لتحديث حالة السوق
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { price: currentPrice, symbol } 
        }));
        
        // تحديث مرجع السعر الأخير
        lastPriceRef.current = currentPrice;
      }
    }
  }, [currentPrice, symbol]);

  useAnalysisChecker({
    symbol,
    currentPriceRef
  });

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

    const attemptInitialPriceRequest = () => {
      try {
        window.postMessage({ method: 'getCurrentPrice', symbol }, '*');
        console.log('Sent getCurrentPrice request to TradingView via window.postMessage');
      } catch (e) {
        console.warn('Failed to request initial price from TradingView', e);
      }
    };
    
    // Try to get initial price after chart loads
    const initialPriceTimer = setTimeout(attemptInitialPriceRequest, 3000);
    
    // Set up regular price updates
    const priceUpdateTimer = setInterval(attemptInitialPriceRequest, 5000);

    return () => {
      clearTimeout(initialPriceTimer);
      clearInterval(priceUpdateTimer);
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div 
        ref={container}
        style={{ height: "100%", width: "100%" }}
      />
      <CurrentPriceDisplay price={currentPrice} />
    </div>
  );
}

export default TradingViewWidget;
