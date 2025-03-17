
import React, { useState, useEffect } from 'react';
import { TradingViewContainer } from './TradingViewContainer';

function TradingViewWidget() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  const handlePriceUpdate = (price: number) => {
    console.log(`تم تحديث السعر في TradingViewWidget: ${price}`);
    setCurrentPrice(price);
    
    // تحديث أي عناصر عرض السعر في الصفحة
    document.querySelectorAll('#stats-price-display').forEach(element => {
      element.textContent = price.toFixed(2);
      console.log('تم تحديث عنصر عرض السعر');
    });
    
    // إرسال حدث تحديث السعر إلى باقي التطبيق
    window.dispatchEvent(new CustomEvent('tradingview-price-update', {
      detail: { price, timestamp: Date.now(), symbol: 'CFI:XAUUSD' }
    }));
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      {/* عنوان الشارت */}
      <div className="py-2 text-lg font-bold text-white bg-gray-900 text-center rounded-t-lg">
        الذهب (CFI:XAUUSD)
      </div>
      
      {/* ويدجيت TradingView */}
      <div className="w-full h-[200px] bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <TradingViewContainer onPriceUpdate={handlePriceUpdate} />
      </div>
    </div>
  );
}

export default TradingViewWidget;
