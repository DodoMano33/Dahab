
import React from 'react';
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
