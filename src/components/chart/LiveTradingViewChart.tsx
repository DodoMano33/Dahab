
import React, { useEffect } from 'react';
import TradingViewWidget from './TradingViewWidget';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate
}) => {
  useEffect(() => {
    console.log('تم تركيب مكون LiveTradingViewChart');
    return () => console.log('تم إزالة مكون LiveTradingViewChart');
  }, []);

  return (
    <div className="w-full mb-6">
      <div className="p-1 bg-gray-800 rounded-lg">
        <TradingViewWidget 
          symbol="XAUUSD"
          onSymbolChange={onSymbolChange}
          onPriceUpdate={onPriceUpdate}
        />
      </div>
    </div>
  );
};
