
import React, { useEffect, useState } from 'react';

interface CurrentPriceDisplayProps {
  provider?: string;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ 
  provider = "CFI" 
}) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  
  // الاستماع فقط لأحداث تحديث السعر من TradingViewWidget
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail?.price) {
        setCurrentPrice(event.detail.price);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    };
    
    window.addEventListener('price-updated', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('price-updated', handlePriceUpdate as EventListener);
    };
  }, []);
  
  // عرض رسالة عندما لا يتوفر سعر
  if (currentPrice === null) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
          <span className="text-gray-300 mr-2">الذهب مقابل الدولار ({provider}:XAUUSD)</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="font-bold text-2xl text-gray-400" id="stats-price-display">
            جاري الحصول على السعر...
          </span>
          <div className="flex items-center">
            <span className="text-xs text-gray-400">ننتظر تحديث من الشارت</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between"
      id="tradingview-price-display"
    >
      <div className="flex items-center mb-2 md:mb-0">
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
        <span className="text-gray-300 mr-2">الذهب مقابل الدولار ({provider}:XAUUSD)</span>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="font-bold text-2xl text-yellow-500 price-display" id="stats-price-display">
          {currentPrice.toFixed(2)}
        </span>
        <div className="flex items-center">
          <span className="text-gray-300 text-sm ml-1">USD</span>
          {lastUpdated && <span className="text-xs text-gray-400 mr-2">آخر تحديث: {lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
};
