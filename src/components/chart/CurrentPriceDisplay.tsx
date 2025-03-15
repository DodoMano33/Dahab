
import React, { useState, useEffect } from 'react';
import { TradingViewStats } from './TradingViewStats';
import { getLastExtractedPrice } from '@/utils/price/screenshotPriceExtractor';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price: propPrice }) => {
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  
  // استدعاء السعر المستخرج من الصورة
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setExtractedPrice(event.detail.price);
      }
    };

    // الاستماع لتحديثات السعر
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // التحقق من آخر سعر ملتقط عند التحميل
    const lastPrice = getLastExtractedPrice();
    if (lastPrice !== null) {
      setExtractedPrice(lastPrice);
    }
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    };
  }, []);
  
  // استخدام السعر المستخرج إذا كان متاحًا، وإلا استخدام السعر من الخاصية
  const price = extractedPrice !== null ? extractedPrice : propPrice;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/95 text-white py-4 px-3">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">
            <span className="text-yellow-500 mr-1">CFI:</span>
            XAUUSD (الذهب)
          </div>
          <div className="text-sm" id="tradingview-price-display">
            {price ? 
              `السعر الحالي: ${price.toFixed(2)}` : 
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
