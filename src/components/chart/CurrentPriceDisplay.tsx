
import React, { useEffect, useState } from 'react';
import { TradingViewStats } from './TradingViewStats';
import { useExtractedPrice } from '@/hooks/useExtractedPrice';

interface CurrentPriceDisplayProps {
  price: number | null;
  provider?: string;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ 
  price: propPrice, 
  provider = 'CFI' 
}) => {
  // استخدام الهوك الجديد للحصول على السعر المستخرج
  const { 
    price: extractedPrice, 
    priceSource, 
    hasPrice, 
    isAlphaVantagePrice 
  } = useExtractedPrice({
    defaultPrice: propPrice
  });

  // إضافة متغير لتخزين السعر المعروض على الشارت
  const [chartPrice, setChartPrice] = useState<number | null>(null);

  // الاستماع لتحديثات السعر المباشرة من الشارت
  useEffect(() => {
    const updateChartPrice = (event: any) => {
      if (event.detail && event.detail.price) {
        // تحديث السعر من الشارت مباشرة
        setChartPrice(event.detail.price);
      }
    };

    // الاستماع لحدث السعر من الشارت مباشرة
    window.addEventListener('chart-price-update', updateChartPrice);
    
    return () => {
      window.removeEventListener('chart-price-update', updateChartPrice);
    };
  }, []);

  // اختيار السعر المناسب للعرض (الأفضلية للسعر المستخرج من الصورة)
  const displayPrice = extractedPrice || chartPrice || propPrice;

  // تحديد نص مصدر السعر
  const getPriceSourceText = () => {
    if (priceSource === 'extracted') {
      return ` (${provider} - مستخرج)`;
    } else if (isAlphaVantagePrice) {
      return ' (Alpha Vantage API)';
    } else if (chartPrice !== null) {
      return ` (${provider} - مباشر)`;
    } else if (priceSource === 'tradingview') {
      return ` (${provider})`;
    }
    return ` (${provider})`;
  };

  return (
    <div className="bg-black/95 text-white py-4 px-3 rounded-lg shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">
            <span className="text-yellow-500 mr-1">{provider}:</span>
            XAUUSD (الذهب)
          </div>
          <div className="text-sm" id="tradingview-price-display">
            {hasPrice || chartPrice ? 
              `السعر الحالي: ${displayPrice!.toFixed(2)}${getPriceSourceText()}` : 
              'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
            }
          </div>
        </div>
        
        <TradingViewStats symbol={`${provider}:XAUUSD`} />
      </div>
    </div>
  );
};
