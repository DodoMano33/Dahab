
import React from 'react';
import { TradingViewStats } from './TradingViewStats';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/95 text-white py-4 px-3">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">
            <span className="text-yellow-500 mr-1">CFI:</span>
            XAUUSD (الذهب)
          </div>
          <div className="text-sm">
            {price ? 
              `السعر الحالي: ${price}` : 
              'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
            }
          </div>
        </div>
        
        {/* عرض مكون المؤشرات */}
        <TradingViewStats symbol="CFI:XAUUSD" />
      </div>
    </div>
  );
};
