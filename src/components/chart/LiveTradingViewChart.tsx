
import React, { useEffect, useRef } from 'react';
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
  const initializedRef = useRef<boolean>(false);
  const lastSymbolRef = useRef<string | null>(null);
  const lastPriceRef = useRef<number | null>(null);
  
  // Handler for symbol changes
  const handleSymbolChange = (newSymbol: string) => {
    if (!newSymbol || newSymbol === lastSymbolRef.current) return;
    
    lastSymbolRef.current = newSymbol;
    console.log("LiveTradingViewChart: Symbol changed to:", newSymbol);
    
    if (onSymbolChange) {
      onSymbolChange(newSymbol);
    }
  };

  // Handler for price updates
  const handlePriceUpdate = (newPrice: number) => {
    if (!newPrice || newPrice === lastPriceRef.current) return;
    
    lastPriceRef.current = newPrice;
    console.log("LiveTradingViewChart: Price updated to:", newPrice);
    
    if (onPriceUpdate) {
      onPriceUpdate(newPrice);
    }
  };

  // Ensure initial values are passed up to parent components on mount
  useEffect(() => {
    if (!initializedRef.current && symbol) {
      initializedRef.current = true;
      const cleanedSymbol = cleanSymbolName(symbol);
      console.log("LiveTradingViewChart: Initial symbol:", cleanedSymbol);
      
      if (onSymbolChange) {
        onSymbolChange(cleanedSymbol);
      }
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
