
import React from 'react';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { useIsMobile } from '@/hooks/use-mobile';

interface TradingViewStatsProps {
  symbol?: string;
}

export const TradingViewStats: React.FC<TradingViewStatsProps> = ({ 
  symbol = "CFI:XAUUSD" 
}) => {
  const { currentPrice, marketData } = useCurrentPrice();
  const isMobile = useIsMobile();
  
  const dayLow = marketData?.dayLow || (currentPrice ? Math.round(currentPrice * 0.997) : 2978);
  const dayHigh = marketData?.dayHigh || (currentPrice ? Math.round(currentPrice * 1.003) : 3005);
  const weekLow = marketData?.weekLow || 2146;
  const weekHigh = marketData?.weekHigh || 3005;
  
  const technicalRecommendation = marketData?.recommendation || "Strong buy";
  
  let technicalPosition = 85;
  
  if (marketData?.recommendation) {
    switch (marketData.recommendation.toLowerCase()) {
      case "strong sell": technicalPosition = 10; break;
      case "sell": technicalPosition = 30; break;
      case "neutral": technicalPosition = 50; break;
      case "buy": technicalPosition = 70; break;
      case "strong buy": technicalPosition = 90; break;
      default: technicalPosition = 50;
    }
  }
  
  const change = marketData?.change !== undefined ? marketData.change : -3.785;
  const changePercent = marketData?.changePercent !== undefined ? marketData.changePercent : -0.13;
  const changeColor = change >= 0 ? "text-green-500" : "text-red-500";
  
  const dayRangePercentage = currentPrice 
    ? Math.min(100, Math.max(0, ((currentPrice - dayLow) / (dayHigh - dayLow)) * 100)) 
    : 30;
  
  const weekRangePercentage = currentPrice 
    ? Math.min(100, Math.max(0, ((currentPrice - weekLow) / (weekHigh - weekLow)) * 100)) 
    : 95;

  return (
    <div className={`w-full text-white text-xs ${isMobile ? 'space-y-4' : 'grid grid-cols-3 gap-2'}`}>
      <div className={`flex flex-col ${isMobile ? 'items-center' : 'items-start'}`}>
        <div className="text-lg font-bold">
          <span className="text-yellow-500 mr-1">CFI:</span>XAUUSD
        </div>
        <div className="flex items-center">
          <span className="text-4xl font-bold" id="stats-price-display">{currentPrice?.toFixed(2) || '2984.91'}</span>
          <span className="ml-1 text-lg">USD</span>
        </div>
        <div className={changeColor}>
          {change.toFixed(3)} {changePercent.toFixed(2)}%
        </div>
        <div className="text-gray-400">GOLD VS US DOLLAR</div>
      </div>

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

      <div className="flex flex-col justify-start items-end">
        <div className="text-gray-300 mb-2 font-medium">Technicals</div>
        
        <div className="flex justify-between text-xs mb-1 w-full">
          <span className="text-gray-400">Sell</span>
          <span className="text-gray-400">Neutral</span>
          <span className="text-gray-400">Buy</span>
        </div>
        
        <div className="relative h-2 rounded-full overflow-hidden mb-1 w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>
          <div className="absolute h-4 w-4 bg-white rounded-full top-1/2 transform -translate-y-1/2 shadow-md" 
               style={{ left: `${technicalPosition}%` }}></div>
        </div>
        
        <div className="text-center font-bold text-white text-base mt-1 mb-2 w-full">{technicalRecommendation}</div>
        
        <button className="bg-gray-800 hover:bg-gray-700 rounded-full py-1 px-3 text-xs mt-1 text-gray-300">
          More technicals
        </button>
      </div>
    </div>
  );
};
