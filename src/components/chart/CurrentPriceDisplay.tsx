
import React from 'react';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 px-3 text-center flex justify-between items-center">
      <div className="font-bold text-xs">XAUUSD (الذهب)</div>
      <div className="text-sm">
        {price ? 
          `السعر الحالي: ${price}` : 
          'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
        }
      </div>
    </div>
  );
};
