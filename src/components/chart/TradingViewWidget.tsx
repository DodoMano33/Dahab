
import React, { useRef, useState, useCallback } from 'react';
import { useTradingViewMessages } from '@/hooks/trading-view';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { PriceExtractor } from './price-extractor/PriceExtractor';
import { TradingViewScript } from './widget/TradingViewScript';
import { ChartInitializer } from './widget/ChartInitializer';
import { PriceRequester } from './widget/PriceRequester';

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
  const currentPriceRef = useRef<number | null>(null);
  const forcedSymbol = "XAUUSD"; // تثبيت الرمز على XAUUSD
  const [isWidgetLoaded, setIsWidgetLoaded] = useState<boolean>(false);
  const [isChartReady, setIsChartReady] = useState<boolean>(false);

  const { currentPrice, extractionMethods } = useTradingViewMessages({
    symbol: forcedSymbol,
    onSymbolChange,
    onPriceUpdate
  });

  // استدعاء عند تحميل سكريبت TradingView
  const handleScriptLoaded = useCallback(() => {
    setIsWidgetLoaded(true);
  }, []);

  // استدعاء عند جاهزية المخطط
  const handleChartReady = useCallback(() => {
    setIsChartReady(true);
  }, []);

  // استدعاء عند تحديث السعر
  const handlePriceUpdate = useCallback((price: number) => {
    currentPriceRef.current = price;
    onPriceUpdate?.(price);
    
    window.dispatchEvent(new CustomEvent('global-price-update', { 
      detail: { 
        price: price, 
        symbol: forcedSymbol,
        methods: extractionMethods,
        source: 'TradingViewWidget'
      }
    }));
  }, [forcedSymbol, extractionMethods, onPriceUpdate]);

  // تحديث السعر المرجعي عند تغيير السعر الحالي
  React.useEffect(() => {
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

  // استخدام مدقق التحليل
  useAnalysisChecker({
    symbol: forcedSymbol,
    currentPriceRef
  });

  // معالجة السعر المستخرج من DOM
  const handleExtractedPrice = useCallback((extractedPrice: number) => {
    console.log(`Price extracted from DOM: ${extractedPrice}`);
    handlePriceUpdate(extractedPrice);
  }, [handlePriceUpdate]);

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* تحميل سكريبت TradingView */}
      <TradingViewScript onScriptLoaded={handleScriptLoaded} />
      
      {/* تهيئة مخطط TradingView عند تحميل السكريبت */}
      {isWidgetLoaded && (
        <ChartInitializer
          forcedSymbol={forcedSymbol}
          onChartReady={handleChartReady}
          onPriceExtraction={handlePriceUpdate}
        />
      )}
      
      {/* طلب السعر عند جاهزية المخطط */}
      {isChartReady && (
        <PriceRequester
          onPriceUpdate={handlePriceUpdate}
          forcedSymbol={forcedSymbol}
        />
      )}
      
      {/* عرض السعر الحالي */}
      <CurrentPriceDisplay price={currentPrice} />
      
      {/* مستخرج السعر */}
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
