
import React, { useState } from 'react';
import TradingViewWidget from './TradingViewWidget';

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
  const [isLoading, setIsLoading] = useState(true);

  const handleSymbolChange = (newSymbol: string) => {
    console.log("LiveTradingViewChart: Symbol changed to", newSymbol);
    if (onSymbolChange) {
      // Format symbol if needed
      let formattedSymbol = newSymbol;
      // If it includes a colon, extract the right part
      if (newSymbol.includes(':')) {
        formattedSymbol = newSymbol.split(':')[1];
      }
      onSymbolChange(formattedSymbol);
    }
  };

  const handlePriceUpdate = (price: number) => {
    console.log("LiveTradingViewChart: Price updated to", price);
    if (onPriceUpdate && !isNaN(price)) {
      onPriceUpdate(price);
    }
  };

  return (
    <div className="w-full h-full relative">
      <TradingViewWidget 
        symbol={symbol}
        onSymbolChange={handleSymbolChange}
        onPriceUpdate={handlePriceUpdate}
      />
    </div>
  );
};
