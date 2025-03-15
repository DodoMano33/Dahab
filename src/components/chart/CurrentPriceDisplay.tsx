
import React, { useEffect } from 'react';
import { TradingViewStats } from './TradingViewStats';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePriceReader } from '@/hooks/usePriceReader';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price: initialPrice }) => {
  const isMobile = useIsMobile();
  // استخدام قارئ السعر من الشاشة
  const { price: screenPrice } = usePriceReader(1000); // تحديث كل ثانية
  
  // استخدام السعر المقروء من الشاشة إذا كان متاحًا، وإلا استخدم السعر الأولي
  const displayPrice = screenPrice !== null ? screenPrice : initialPrice;
  
  // إرسال حدث تحديث السعر للمكونات الأخرى
  useEffect(() => {
    if (displayPrice !== null) {
      // نرسل حدثًا بالسعر الحالي
      window.dispatchEvent(new CustomEvent('tradingview-price-update', {
        detail: {
          price: displayPrice,
          symbol: 'XAUUSD'
        }
      }));
      console.log('CurrentPriceDisplay dispatched price update:', displayPrice);
    }
  }, [displayPrice]);
  
  return (
    <div className="bg-black/95 text-white py-4 px-3 w-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">XAUUSD (الذهب)</div>
          <div className="text-sm">
            {displayPrice ? 
              `السعر الحالي: ${displayPrice}` : 
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
