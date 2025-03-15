
import React, { useEffect } from 'react';
import { TradingViewStats } from './TradingViewStats';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePriceReader } from '@/hooks/usePriceReader';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price: initialPrice }) => {
  const isMobile = useIsMobile();
  // استخدام قارئ السعر من الشاشة مع تحديث أسرع
  const { price: screenPrice, isActive, isMarketOpen } = usePriceReader(500); // تحديث كل نصف ثانية
  
  // استخدام السعر المقروء من الشاشة إذا كان متاحًا، وإلا استخدم السعر الأولي
  const displayPrice = screenPrice !== null ? screenPrice : initialPrice;
  
  // إرسال حدث تحديث السعر للمكونات الأخرى
  useEffect(() => {
    if (displayPrice !== null) {
      // إرسال حدث تحديث السعر
      window.dispatchEvent(new CustomEvent('tradingview-price-update', {
        detail: {
          price: displayPrice,
          symbol: 'XAUUSD',
          isMarketOpen: isMarketOpen
        }
      }));
      
      // إرسال حدث السعر المباشر أيضًا
      window.dispatchEvent(new CustomEvent('tradingview-direct-price', {
        detail: { 
          price: displayPrice,
          symbol: 'XAUUSD'
        }
      }));
      
      console.log('CurrentPriceDisplay dispatched price update:', displayPrice);
    }
  }, [displayPrice, isMarketOpen]);
  
  return (
    <div className="bg-black/95 text-white py-4 px-3 w-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">XAUUSD (الذهب)</div>
          <div className="text-sm flex items-center gap-2">
            {/* عرض حالة السوق */}
            <div className={`px-1.5 py-0.5 rounded-full text-[10px] inline-flex items-center justify-center w-14 ${isMarketOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isMarketOpen ? 'مفتوح' : 'مغلق'}
            </div>
            
            {/* عرض السعر */}
            <div>
              {displayPrice ? 
                `السعر الحالي: ${displayPrice}` : 
                'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
              }
            </div>
          </div>
        </div>
        
        {/* إضافة المكون الجديد مع تمرير حالة عرض الموبايل */}
        <TradingViewStats />
      </div>
    </div>
  );
};
