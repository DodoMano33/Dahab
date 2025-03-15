
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
  // استخدام CFI:XAUUSD كرمز داخلي، لكن عند التواصل مع المكونات الأخرى نستخدم XAUUSD فقط
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
