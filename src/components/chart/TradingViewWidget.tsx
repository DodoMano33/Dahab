import React, { useEffect, useRef, useState } from 'react';
import { useTradingViewMessages } from '@/hooks/trading-view';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { PriceExtractor } from './price-extractor/PriceExtractor';

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
  const currentPriceRef = useRef<number | null>(null);
  const widgetRef = useRef<any>(null);
  const forcedSymbol = "XAUUSD"; // تثبيت الرمز على XAUUSD
  const chartReadyRef = useRef<boolean>(false);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState<boolean>(false);
  const priceRequestIntervals = useRef<NodeJS.Timeout[]>([]);

  const { currentPrice, extractionMethods } = useTradingViewMessages({
    symbol: forcedSymbol,
    onSymbolChange,
    onPriceUpdate
  });

  useEffect(() => {
    if (currentPrice !== null) {
      currentPriceRef.current = currentPrice;
      console.log('Current price updated in TradingViewWidget:', currentPrice, 'Methods:', extractionMethods);
      
      window.dispatchEvent(new CustomEvent('global-price-update', { 
        detail: { 
          price: currentPrice, 
          symbol: forcedSymbol,
          methods: extractionMethods,
          source: 'TradingViewWidget'
        }
      }));
    }
  }, [currentPrice, forcedSymbol, extractionMethods]);

  useAnalysisChecker({
    symbol: forcedSymbol,
    currentPriceRef
  });

  const requestPriceFromTradingView = () => {
    try {
      window.postMessage({ method: 'getCurrentPrice', symbol: forcedSymbol }, '*');
      console.log('Sent getCurrentPrice request to TradingView via window.postMessage');
      
      if (window.tvWidget && window.tvWidget.chart) {
        try {
          const chartPrice = window.tvWidget.chart().crosshairPrice();
          if (chartPrice && !isNaN(chartPrice)) {
            console.log('Got price directly from chart API:', chartPrice);
            currentPriceRef.current = chartPrice;
            onPriceUpdate?.(chartPrice);
            window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
              detail: { 
                price: chartPrice, 
                symbol: forcedSymbol,
                source: 'Chart API Direct'
              }
            }));
          }
        } catch (chartError) {
          console.warn('Error accessing chart API:', chartError);
        }
      }
      
      try {
        const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
        if (priceElements.length > 0) {
          for (const element of Array.from(priceElements)) {
            const priceText = element.textContent;
            if (priceText) {
              const price = parseFloat(priceText.replace(',', ''));
              if (!isNaN(price) && price > 0) {
                console.log('Got price from DOM:', price);
                currentPriceRef.current = price;
                onPriceUpdate?.(price);
                window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
                  detail: { 
                    price, 
                    symbol: forcedSymbol,
                    source: 'DOM Element'
                  }
                }));
                break;
              }
            }
          }
        }
      } catch (domError) {
        console.warn('Error extracting price from DOM:', domError);
      }
    } catch (e) {
      console.warn('Failed to request price from TradingView', e);
    }
  };

  useEffect(() => {
    console.log('TradingViewWidget mounted with symbol:', forcedSymbol);
    
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      console.log('TradingView script loaded');
      setIsWidgetLoaded(true);
    };
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isWidgetLoaded || !container.current) return;
    
    console.log('Initializing TradingView widget');
    const config = {
      autosize: true,
      symbol: `OANDA:${forcedSymbol}`,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: true,
      hotlist: true,
      calendar: true,
      studies: ["MASimple@tv-basicstudies"],
      container_id: "tradingview_widget",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user",
      debug: true
    };
    
    try {
      if (container.current) {
        container.current.innerHTML = '';
      }
      
      const widget = new window.TradingView.widget(config);
      widgetRef.current = widget;
      window.tvWidget = widget;
      
      widget.onChartReady(() => {
        console.log('TradingView chart is ready');
        chartReadyRef.current = true;
        
        scheduleInitialPriceRequests();
        
        try {
          const chart = widget.chart();
          const symbolInfo = chart.symbol();
          console.log('Current symbol:', symbolInfo);
          
          const directPrice = chart.crosshairPrice();
          if (directPrice && !isNaN(directPrice)) {
            console.log('Extracted price directly from chart:', directPrice);
            currentPriceRef.current = directPrice;
            onPriceUpdate?.(directPrice);
            
            window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
              detail: { 
                price: directPrice, 
                symbol: forcedSymbol,
                source: 'Chart Ready Event'
              }
            }));
          }
        } catch (chartApiError) {
          console.warn('Error accessing chart API on ready:', chartApiError);
        }
      });
      
    } catch (widgetError) {
      console.error('Error initializing TradingView widget:', widgetError);
    }
    
    return () => {
      priceRequestIntervals.current.forEach(clearTimeout);
      
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [isWidgetLoaded, forcedSymbol, onPriceUpdate]);

  const scheduleInitialPriceRequests = () => {
    priceRequestIntervals.current.forEach(clearTimeout);
    priceRequestIntervals.current = [];
    
    for (let i = 1; i <= 10; i++) {
      const timeoutId = setTimeout(requestPriceFromTradingView, i * 1000);
      priceRequestIntervals.current.push(timeoutId);
    }
    
    for (let i = 1; i <= 10; i++) {
      const timeoutId = setTimeout(requestPriceFromTradingView, 10000 + i * 3000);
      priceRequestIntervals.current.push(timeoutId);
    }
    
    for (let i = 1; i <= 6; i++) {
      const timeoutId = setTimeout(requestPriceFromTradingView, 40000 + i * 10000);
      priceRequestIntervals.current.push(timeoutId);
    }
    
    const regularPriceInterval = setInterval(requestPriceFromTradingView, 20000);
    priceRequestIntervals.current.push(regularPriceInterval as unknown as NodeJS.Timeout);
  };
  
  useEffect(() => {
    const initialDelayTimer = setTimeout(() => {
      scheduleInitialPriceRequests();
    }, 3000);
    
    return () => clearTimeout(initialDelayTimer);
  }, []);

  const handleExtractedPrice = (extractedPrice: number) => {
    console.log(`Price extracted from DOM: ${extractedPrice}`);
    if (onPriceUpdate) {
      onPriceUpdate(extractedPrice);
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div 
        id="tradingview_widget"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      />
      <CurrentPriceDisplay price={currentPrice} />
      
      <div className="absolute top-2 left-2 z-10" style={{ width: '300px' }}>
        <PriceExtractor 
          defaultInterval={10000} 
          onPriceExtracted={handleExtractedPrice}
          customSelectors={[]}
        />
      </div>
    </div>
  );
}

export default TradingViewWidget;
