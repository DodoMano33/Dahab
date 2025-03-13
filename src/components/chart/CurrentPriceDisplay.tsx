
import React, { useEffect, useState } from 'react';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price }) => {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [animatePrice, setAnimatePrice] = useState<boolean>(false);
  
  // تحديث وقت آخر تحديث للسعر
  useEffect(() => {
    if (price !== null) {
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      
      // تفعيل تأثير الرسوم المتحركة عند تغيير السعر
      setAnimatePrice(true);
      const timer = setTimeout(() => setAnimatePrice(false), 1000);
      
      return () => clearTimeout(timer);
    }
  }, [price]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 px-3 text-center flex justify-between items-center">
      <div className="font-bold text-xs">XAUUSD (الذهب)</div>
      <div className={`text-sm flex flex-col items-end ${animatePrice ? 'text-green-400 font-bold' : ''}`}>
        {price ? (
          <>
            <span className="transition-all duration-300">
              السعر الحالي: {price}
            </span>
            <span className="text-xs text-gray-400">
              آخر تحديث: {lastUpdated}
            </span>
          </>
        ) : (
          <span className="text-yellow-400 animate-pulse">
            بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)
          </span>
        )}
      </div>
    </div>
  );
};
