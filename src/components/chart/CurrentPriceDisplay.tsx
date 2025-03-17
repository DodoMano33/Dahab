
import React, { useEffect } from 'react';

interface CurrentPriceDisplayProps {
  price: number | null;
  provider?: string;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ 
  price, 
  provider = "CFI" 
}) => {
  // سجل التغييرات في السعر
  useEffect(() => {
    if (price !== null) {
      console.log(`تم تحديث عرض السعر: ${price}`);
    }
  }, [price]);

  const displayPrice = price !== null ? price.toFixed(2) : "---.--";
  
  return (
    <div 
      className="bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between"
      id="tradingview-price-display"
    >
      <div className="flex items-center mb-2 md:mb-0">
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
        <span className="text-gray-300 mr-2">الذهب مقابل الدولار ({provider}:XAUUSD)</span>
      </div>
      
      <div className="flex items-center">
        <span className="font-bold text-2xl text-yellow-500" id="stats-price-display">
          {displayPrice}
        </span>
        <span className="text-gray-300 ml-1">USD</span>
      </div>
    </div>
  );
};
