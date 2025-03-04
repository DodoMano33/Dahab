
import React from 'react';
import TradingViewWidget from './TradingViewWidget';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
  setSymbol?: (symbol: string) => void;  // Added prop to set symbol
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "CAPITALCOM:GOLD",
  onSymbolChange,
  onPriceUpdate,
  setSymbol
}) => {
  return (
    <div className="w-full h-full">
      <TradingViewWidget 
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        onPriceUpdate={onPriceUpdate}
        setSymbol={setSymbol}
      />
    </div>
  );
};
