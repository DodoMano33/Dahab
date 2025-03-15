
import React from 'react';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';

interface TradingViewStatsProps {
  symbol?: string;
}

export const TradingViewStats: React.FC<TradingViewStatsProps> = ({ 
  symbol = "XAUUSD" 
}) => {
  const { currentPrice } = useCurrentPrice();
  
  // نحدد قيم افتراضية لنطاقات السعر والتوصية الفنية
  const dayLow = currentPrice ? Math.round(currentPrice * 0.997) : 2978;
  const dayHigh = currentPrice ? Math.round(currentPrice * 1.003) : 3005;
  const weekLow = 2146;
  const weekHigh = 3005;
  
  // احتساب نسبة موقع السعر الحالي ضمن النطاق اليومي
  const dayRangePercentage = currentPrice 
    ? Math.min(100, Math.max(0, ((currentPrice - dayLow) / (dayHigh - dayLow)) * 100)) 
    : 30;
  
  // احتساب نسبة موقع السعر الحالي ضمن النطاق الأسبوعي
  const weekRangePercentage = currentPrice 
    ? Math.min(100, Math.max(0, ((currentPrice - weekLow) / (weekHigh - weekLow)) * 100)) 
    : 95;

  // تحديد التوصية الفنية (افتراضياً Strong buy)
  const technicalRecommendation = "Strong buy";
  const technicalPosition = 85; // قيمة تمثل موقع المؤشر (0-100)

  return (
    <div className="w-full grid grid-cols-3 gap-2 text-white text-xs">
      {/* قسم معلومات السعر */}
      <div className="flex flex-col items-end">
        <div className="text-lg font-bold">{symbol}</div>
        <div className="flex items-center">
          <span className="text-2xl font-bold">{currentPrice || 2984.91}</span>
          <span className="ml-1">USD</span>
        </div>
        <div className="text-red-500">-3.785 -0.13%</div>
        <div className="text-gray-400">Market closed</div>
      </div>

      {/* قسم نطاقات السعر */}
      <div className="flex flex-col justify-center">
        <div className="text-gray-400 mb-1">DAY'S RANGE</div>
        <div className="flex items-center justify-between mb-1">
          <span>{dayLow}</span>
          <span>{dayHigh}</span>
        </div>
        <div className="relative h-1 bg-gray-700 rounded-full mb-3">
          <div className="absolute h-full w-1 bg-teal-400" style={{ left: `${dayRangePercentage}%`, transform: 'translateX(-50%)' }}></div>
          <div className="absolute top-1 h-0 w-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" style={{ left: `${dayRangePercentage}%`, transform: 'translateX(-50%)' }}></div>
        </div>
        
        <div className="text-gray-400 mb-1">52WK RANGE</div>
        <div className="flex items-center justify-between mb-1">
          <span>{weekLow}</span>
          <span>{weekHigh}</span>
        </div>
        <div className="relative h-1 bg-gray-700 rounded-full">
          <div className="absolute h-full w-1 bg-teal-400" style={{ left: `${weekRangePercentage}%`, transform: 'translateX(-50%)' }}></div>
          <div className="absolute top-1 h-0 w-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" style={{ left: `${weekRangePercentage}%`, transform: 'translateX(-50%)' }}></div>
        </div>
      </div>

      {/* قسم المؤشرات الفنية */}
      <div className="flex flex-col justify-start">
        <div className="text-gray-400 mb-2">Technicals</div>
        <div className="flex justify-between text-gray-400 mb-1">
          <span>Sell</span>
          <span className="text-center">Neutral</span>
          <span>Buy</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden mb-1">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-green-500"></div>
          <div className="absolute h-4 w-4 bg-white rounded-full top-1/2 transform -translate-y-1/2" style={{ left: `${technicalPosition}%` }}></div>
        </div>
        <div className="text-center font-bold text-sm mb-2">{technicalRecommendation}</div>
        <button className="bg-gray-700 hover:bg-gray-600 rounded-full py-1 px-3 text-xs self-center">
          More technicals
        </button>
      </div>
    </div>
  );
};
