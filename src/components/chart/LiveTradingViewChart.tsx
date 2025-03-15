
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
  // استخدام الرمز المثبت XAUUSD دائمًا
  return (
    <div className="w-full h-full mb-8">
      <TradingViewWidget 
        symbol="XAUUSD" // سيتم تطبيق "CFI:XAUUSD" داخل المكون
        onSymbolChange={onSymbolChange}
        onPriceUpdate={onPriceUpdate}
      />
    </div>
  );
};
