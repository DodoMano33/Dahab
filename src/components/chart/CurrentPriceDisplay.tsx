
import React, { useEffect, useState } from 'react';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';

interface CurrentPriceDisplayProps {
  provider?: string;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ 
  provider = "CFI" 
}) => {
  const { currentPrice } = useCurrentPrice();
  const [directPrice, setDirectPrice] = useState<number | null>(null);
  const lastUpdated = new Date().toLocaleTimeString();
  
  // محاولة الحصول على السعر المباشر
  useEffect(() => {
    const updateDirectPrice = () => {
      const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
      for (const element of priceElements) {
        const text = element.textContent?.trim();
        if (text) {
          const price = parseFloat(text.replace(/,/g, ''));
          if (!isNaN(price) && price >= 1800 && price <= 3500) {
            setDirectPrice(price);
            
            // بث السعر المستخرج إلى التطبيق
            window.dispatchEvent(new CustomEvent('tradingview-price-update', {
              detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
            }));
            return;
          }
        }
      }
    };
    
    // التحديث الأولي
    updateDirectPrice();
    
    // تحديث دوري
    const interval = setInterval(updateDirectPrice, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // استخدام السعر المباشر إذا كان متاحاً، وإلا استخدام السعر من useCurrentPrice
  const displayPrice = directPrice || currentPrice;
  
  // عرض رسالة عندما لا يتوفر سعر
  if (displayPrice === null) {
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
          {displayPrice.toFixed(2)}
        </span>
        <div className="flex items-center">
          <span className="text-gray-300 text-sm ml-1">USD</span>
          {lastUpdated && <span className="text-xs text-gray-400 mr-2">آخر تحديث: {lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
};
