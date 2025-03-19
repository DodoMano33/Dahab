
import React from 'react';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center">
      {price ? 
        `السعر الحالي من Alpha Vantage: ${price}` : 
        'بانتظار السعر من Alpha Vantage... (قد يستغرق التحميل بضع ثوانٍ)'
      }
    </div>
  );
};
