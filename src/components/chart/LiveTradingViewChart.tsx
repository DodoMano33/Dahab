
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
  const handleSymbolChange = (newSymbol: string) => {
    console.log('LiveTradingViewChart received symbol change:', newSymbol);
    onSymbolChange?.(newSymbol);
  };

  const handlePriceUpdate = (newPrice: number) => {
    console.log('LiveTradingViewChart received price update:', newPrice);
    onPriceUpdate?.(newPrice);
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
