
import React from 'react';
import { useTradingViewMessages } from '@/hooks/useTradingViewMessages';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTradingViewChart } from './tradingview/useTradingViewChart';
import { usePriceTracking } from './tradingview/usePriceTracking';

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
  const forcedSymbol = "XAUUSD"; // تثبيت الرمز على XAUUSD
  const isMobile = useIsMobile();
  
  // استخدام hook للتحكم في شارت TradingView
  const { container } = useTradingViewChart(forcedSymbol, isMobile);
  
  // استخدام hook لتتبع السعر
  const { currentPriceRef } = usePriceTracking({
    symbol: forcedSymbol,
    onPriceUpdate
  });
  
  // استخدام hook لرسائل TradingView
  const { currentPrice } = useTradingViewMessages({
    symbol: forcedSymbol,
    onSymbolChange,
    onPriceUpdate
  });

  // ضبط ارتفاع الشارت حسب حجم الشاشة
  const chartHeight = isMobile ? '350px' : '600px';

  return (
    <div className="flex flex-col w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* عرض الشارت بحجم أصغر على الموبايل */}
      <div 
        ref={container}
        className="w-full border-b border-gray-700"
        style={{ height: chartHeight }}
      />
      
      {/* عرض معلومات السعر بشكل منفصل أسفل الشارت */}
      <CurrentPriceDisplay price={currentPriceRef.current} />
    </div>
  );
}

export default TradingViewWidget;
