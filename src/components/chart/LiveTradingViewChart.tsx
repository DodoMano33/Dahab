
import React from 'react';
import TradingViewWidget from './TradingViewWidget';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD", // تثبيت القيمة الافتراضية على XAUUSD
  onSymbolChange,
  onPriceUpdate
}) => {
  // تجاهل symbol المستلمة واستخدام XAUUSD دائمًا
  return (
    <div className="w-full h-full">
      <TradingViewWidget 
        symbol="XAUUSD"
        onSymbolChange={onSymbolChange}
        onPriceUpdate={onPriceUpdate}
      />
    </div>
  );
};
