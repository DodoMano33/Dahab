
import React, { useState, useEffect } from 'react';
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
  const [lastSymbol, setLastSymbol] = useState(symbol);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  // Set loading state on component mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Debounce symbol changes to avoid too many updates
  const handleSymbolChange = (newSymbol: string) => {
    console.log("LiveTradingViewChart: Symbol changed to", newSymbol);
    if (newSymbol !== lastSymbol) {
      setLastSymbol(newSymbol);
      
      if (onSymbolChange) {
        // Format symbol if needed
        let formattedSymbol = newSymbol;
        // If it includes a colon, extract the right part
        if (newSymbol.includes(':')) {
          formattedSymbol = newSymbol.split(':')[1];
        }
        onSymbolChange(formattedSymbol);
      }
    }
  };

  // Debounce price updates to avoid too many updates
  const handlePriceUpdate = (price: number) => {
    console.log("LiveTradingViewChart: Price updated to", price);
    
    // Only update if the price has changed significantly (avoid micro changes)
    const priceDifference = lastPrice ? Math.abs(price - lastPrice) : 1;
    const significantChange = lastPrice === null || priceDifference > 0.01;
    
    if (!isNaN(price) && significantChange) {
      setLastPrice(price);
      if (onPriceUpdate) {
        onPriceUpdate(price);
      }
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
