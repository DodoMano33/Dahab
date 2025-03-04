
import React, { useEffect, useState } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Log initial symbol for debugging
  useEffect(() => {
    console.log('LiveTradingViewChart initialized with symbol:', symbol);
    
    // Mark as loaded after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSymbolChange = (newSymbol: string) => {
    console.log('LiveTradingViewChart received symbol change:', newSymbol);
    
    // Extract the base symbol without the exchange prefix
    let baseSymbol = newSymbol;
    if (newSymbol.includes(':')) {
      baseSymbol = newSymbol.split(':')[1];
    }
    
    onSymbolChange?.(baseSymbol);
  };

  const handlePriceUpdate = (newPrice: number) => {
    console.log('LiveTradingViewChart received price update:', newPrice);
    onPriceUpdate?.(newPrice);
  };

  return (
    <div className="w-full h-[600px] mb-6 rounded-lg shadow-md overflow-hidden">
      {isLoaded && (
        <TradingViewWidget 
          symbol={symbol}
          onSymbolChange={handleSymbolChange}
          onPriceUpdate={handlePriceUpdate}
        />
      )}
    </div>
  );
};
