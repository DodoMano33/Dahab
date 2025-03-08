
import React from 'react';
import { useTradingViewWidget } from './hooks/useTradingViewWidget';
import { TradingViewContainer } from './TradingViewContainer';
import { cleanSymbolName } from '@/utils/tradingViewUtils';

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
  const { 
    containerRef, 
    scriptRef, 
    widgetId, 
    widgetLoaded 
  } = useTradingViewWidget({
    symbol,
    onSymbolChange: (newSymbol) => {
      const cleanedSymbol = cleanSymbolName(newSymbol);
      if (onSymbolChange) {
        onSymbolChange(cleanedSymbol);
      }
    },
    onPriceUpdate
  });

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div 
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
      />
      {widgetId && (
        <TradingViewContainer
          widgetId={widgetId}
          symbol={symbol}
          scriptRef={scriptRef}
          containerRef={containerRef}
        />
      )}
    </div>
  );
}

export default TradingViewWidget;
