
import React, { useEffect, useState } from 'react';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface CurrentPriceDisplayProps {
  price: number | null;
  provider?: string;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ 
  price, 
  provider = "CFI" 
}) => {
  const [localPrice, setLocalPrice] = useState<number | null>(price);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(price === null);
  
  // استخدام السعر المقدم أو استخراج سعر جديد
  useEffect(() => {
    if (price !== null) {
      console.log(`تم تحديث عرض السعر: ${price}`);
      setLocalPrice(price);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
    } else {
      // إذا لم يتم تقديم سعر، حاول استخراجه مباشرة
      setIsLoading(true);
      
      const fetchPrice = async () => {
        // استخراج السعر باستخدام المحدد الجديد أولاً
        const tradingViewPriceElement = document.querySelector('.tv-symbol-price-quote__value.js-symbol-last');
        if (tradingViewPriceElement) {
          const priceText = tradingViewPriceElement.textContent?.trim();
          if (priceText) {
            const extractedPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
            if (!isNaN(extractedPrice) && extractedPrice >= 1800 && extractedPrice <= 3500) {
              console.log(`تم استخراج السعر مباشرة من TradingView: ${extractedPrice}`);
              setLocalPrice(extractedPrice);
              setLastUpdated(new Date().toLocaleTimeString());
              setIsLoading(false);
              return;
            }
          }
        }
        
        // إذا لم ينجح المحدد الجديد، نستخدم الطريقة العامة
        const extractedPrice = await extractPriceFromChart();
        if (extractedPrice !== null) {
          console.log(`تم استخراج السعر مباشرة: ${extractedPrice}`);
          setLocalPrice(extractedPrice);
          setLastUpdated(new Date().toLocaleTimeString());
          setIsLoading(false);
        } else {
          console.log('لم يتم استخراج سعر صالح، سنحاول مرة أخرى...');
        }
      };
      
      fetchPrice();
      
      // جدولة تحديثات دورية
      const interval = setInterval(fetchPrice, 3000);
      return () => clearInterval(interval);
    }
  }, [price]);
  
  // عرض رسالة عندما لا يتوفر سعر
  if (isLoading || localPrice === null) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
          <span className="text-gray-300 mr-2">الذهب مقابل الدولار ({provider}:XAUUSD)</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="font-bold text-2xl text-gray-400" id="stats-price-display">
            جاري استخراج السعر...
          </span>
          <div className="flex items-center">
            <span className="text-xs text-gray-400">نبحث عن السعر في الشارت</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between"
      id="tradingview-price-display"
    >
      <div className="flex items-center mb-2 md:mb-0">
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
        <span className="text-gray-300 mr-2">الذهب مقابل الدولار ({provider}:XAUUSD)</span>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="font-bold text-2xl text-yellow-500" id="stats-price-display">
          {localPrice.toFixed(2)}
        </span>
        <div className="flex items-center">
          <span className="text-gray-300 text-sm ml-1">USD</span>
          {lastUpdated && <span className="text-xs text-gray-400 mr-2">آخر تحديث: {lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
};
