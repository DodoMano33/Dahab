
import React, { useEffect, useRef } from 'react';
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
  const previousSymbolRef = useRef<string>(symbol);
  
  // Log symbol changes for debugging
  useEffect(() => {
    if (symbol !== previousSymbolRef.current) {
      console.log(`LiveTradingViewChart: Symbol changed from ${previousSymbolRef.current} to ${symbol}`);
      previousSymbolRef.current = symbol;
    }
  }, [symbol]);

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
