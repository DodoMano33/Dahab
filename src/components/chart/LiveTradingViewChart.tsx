
import React from 'react';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange
}) => {
  return (
    <div className="w-full mb-6">
      <div className="p-1 bg-gray-800 rounded-lg h-64 flex items-center justify-center text-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">الرسم البياني</h3>
          <p className="text-gray-300">تم إيقاف عرض بيانات الأسعار المباشرة</p>
        </div>
      </div>
    </div>
  );
};
