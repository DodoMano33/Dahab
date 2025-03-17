
import React, { useEffect, useState } from 'react';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface CurrentPriceDisplayProps {
  price: number | null;
  provider?: string;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ 
  price: propPrice, 
  provider = 'CFI' 
}) => {
  const [displayPrice, setDisplayPrice] = useState<number | null>(propPrice);

  // تحديث السعر من الشارت بشكل دوري
  useEffect(() => {
    // تحديث السعر من الخارج
    if (propPrice !== null) {
      setDisplayPrice(propPrice);
    }
    
    // استخراج السعر من الشارت بشكل دوري
    const updatePrice = async () => {
      const extractedPrice = await extractPriceFromChart();
      if (extractedPrice !== null) {
        setDisplayPrice(extractedPrice);
      }
    };
    
    // تحديث فوري
    updatePrice();
    
    // جدولة التحديثات
    const interval = setInterval(updatePrice, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [propPrice]);

  return (
    <div className="bg-black/95 text-white py-4 px-3 rounded-lg shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">
            <span className="text-yellow-500 mr-1">{provider}:</span>
            XAUUSD (الذهب)
          </div>
          <div className="text-sm" id="tradingview-price-display">
            {displayPrice ? 
              `السعر الحالي: ${displayPrice.toFixed(2)}` : 
              'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
            }
          </div>
        </div>
      </div>
    </div>
  );
};
