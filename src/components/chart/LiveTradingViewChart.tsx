
import React, { useEffect, useRef, useState } from 'react';
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
  const [currentSymbol, setCurrentSymbol] = useState<string>(symbol);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const initializedRef = useRef<boolean>(false);
  
  // Handler for symbol changes
  const handleSymbolChange = (newSymbol: string) => {
    if (!newSymbol) return;
    
    setCurrentSymbol(newSymbol);
    console.log("LiveTradingViewChart: Symbol changed to:", newSymbol);
    
    if (onSymbolChange) {
      onSymbolChange(newSymbol);
    }
  };

  // Handler for price updates
  const handlePriceUpdate = (newPrice: number) => {
    if (!newPrice) return;
    
    setCurrentPrice(newPrice);
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

  // Force update parent components with current values periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSymbol && onSymbolChange) {
        onSymbolChange(currentSymbol);
        console.log("LiveTradingViewChart: Forcing symbol update:", currentSymbol);
      }
      
      if (currentPrice && onPriceUpdate) {
        onPriceUpdate(currentPrice);
        console.log("LiveTradingViewChart: Forcing price update:", currentPrice);
      }
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval);
  }, [currentSymbol, currentPrice, onSymbolChange, onPriceUpdate]);

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
