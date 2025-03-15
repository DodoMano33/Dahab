
import React from 'react';
import { TradingViewStats } from './TradingViewStats';
import { useIsMobile } from '@/hooks/use-mobile';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price }) => {
  const isMobile = useIsMobile();
  
  // إرسال حدث تحديث السعر للمكونات الأخرى
  React.useEffect(() => {
    if (price !== null) {
      // نرسل حدثًا بالسعر الحالي
      window.dispatchEvent(new CustomEvent('tradingview-price-update', {
        detail: {
          price,
          symbol: 'XAUUSD'
        }
      }));
      console.log('CurrentPriceDisplay dispatched price update:', price);
    }
  }, [price]);
  
  return (
    <div className="bg-black/95 text-white py-4 px-3 w-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">XAUUSD (الذهب)</div>
          <div className="text-sm">
            {price ? 
              `السعر الحالي: ${price}` : 
              'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
            }
          </div>
        </div>
        
        {/* إضافة المكون الجديد مع تمرير حالة عرض الموبايل */}
        <TradingViewStats />
      </div>
    </div>
  );
};
