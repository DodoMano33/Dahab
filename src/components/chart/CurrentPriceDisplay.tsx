
import React, { useEffect, useState } from 'react';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price }) => {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [animatePrice, setAnimatePrice] = useState<boolean>(false);
  const [priceSource, setPriceSource] = useState<string>('TradingView');
  
  // تحديث وقت آخر تحديث للسعر والمصدر
  useEffect(() => {
    if (price !== null) {
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      
      // تفعيل تأثير الرسوم المتحركة عند تغيير السعر
      setAnimatePrice(true);
      const timer = setTimeout(() => setAnimatePrice(false), 1000);
      
      // تحديد مصدر السعر باستخدام السمات المخصصة
      const customEvent = window.lastPriceEvent;
      if (customEvent && customEvent.source) {
        setPriceSource(customEvent.source);
      } else {
        setPriceSource('TradingView');
      }
      
      // إرسال معلومات السعر إلى وحدة التشخيص
      const diagnosticEvent = new CustomEvent('price-diagnostic-update', {
        detail: {
          price,
          timestamp: now.toISOString(),
          source: priceSource
        }
      });
      window.dispatchEvent(diagnosticEvent);
      
      return () => clearTimeout(timer);
    }
  }, [price, priceSource]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 px-3 text-center flex justify-between items-center">
      <div className="font-bold text-xs">XAUUSD (الذهب)</div>
      <div className={`text-sm flex flex-col items-end ${animatePrice ? 'text-green-400 font-bold' : ''}`}>
        {price ? (
          <>
            <span className="transition-all duration-300">
              السعر الحالي: {price} 
              <span className="text-xs text-gray-400 mr-1">({priceSource})</span>
            </span>
            <span className="text-xs text-gray-400">
              آخر تحديث: {lastUpdated}
            </span>
          </>
        ) : (
          <span className="text-yellow-400 animate-pulse flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)
          </span>
        )}
      </div>
    </div>
  );
};
