
import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full">
      <TradingViewWidget 
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        onPriceUpdate={onPriceUpdate}
      />
    </div>
  );
};
