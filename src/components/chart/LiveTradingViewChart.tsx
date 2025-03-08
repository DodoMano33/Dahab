
import React, { useEffect } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { cleanSymbolName } from '@/utils/tradingViewUtils';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "CAPITALCOM:GOLD",
  onSymbolChange,
  onPriceUpdate
}) => {
  // Handler for symbol changes
  const handleSymbolChange = (newSymbol: string) => {
    console.log("LiveTradingViewChart: Symbol changed to:", newSymbol);
    if (onSymbolChange) {
      onSymbolChange(newSymbol);
    }
  };

  // Handler for price updates
  const handlePriceUpdate = (newPrice: number) => {
    console.log("LiveTradingViewChart: Price updated to:", newPrice);
    if (onPriceUpdate) {
      onPriceUpdate(newPrice);
    }
  };

  // Ensure initial values are passed up to parent components on mount
  useEffect(() => {
    if (symbol && onSymbolChange) {
      const cleanedSymbol = cleanSymbolName(symbol);
      console.log("LiveTradingViewChart: Initial symbol:", cleanedSymbol);
      onSymbolChange(cleanedSymbol);
    }
  }, [symbol, onSymbolChange]);

  return (
    <div className="w-full h-full">
      <TradingViewWidget 
        symbol={symbol}
        onSymbolChange={handleSymbolChange}
        onPriceUpdate={handlePriceUpdate}
      />
    </div>
  );
};
