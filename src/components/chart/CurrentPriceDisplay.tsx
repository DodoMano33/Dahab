
import React from 'react';
import { TradingViewStats } from './TradingViewStats';
import { useIsMobile } from '@/hooks/use-mobile';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-black/95 text-white py-2 px-3 transition-all ${isMobile ? 'bg-opacity-90' : ''}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">XAUUSD (الذهب)</div>
          <div className="text-sm">
            {price ? 
              `السعر الحالي: ${price}` : 
              'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
            }
          </div>
        </div>
        
        {/* إضافة المكون الجديد مع تمرير معلومة أننا في وضع الموبايل */}
        <TradingViewStats />
      </div>
    </div>
  );
};
