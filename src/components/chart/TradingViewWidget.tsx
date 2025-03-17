
import React, { useEffect, useState } from 'react';
import { TradingViewContainer } from './TradingViewContainer';

function TradingViewWidget() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handlePriceUpdate = (price: number) => {
    console.log(`تم تحديث السعر في TradingViewWidget: ${price}`);
    setCurrentPrice(price);
    
    // بث السعر كمصدر واحد للتطبيق
    window.dispatchEvent(new CustomEvent('price-updated', {
      detail: { price }
    }));
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      {/* عنوان الشارت */}
      <div className="py-2 text-lg font-bold text-white bg-gray-900 text-center rounded-t-lg">
        الذهب (CFI:XAUUSD) {currentPrice && ` - ${currentPrice.toFixed(2)}`}
      </div>
      
      {/* ويدجيت TradingView */}
      <div className="w-full h-[200px] bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <TradingViewContainer onPriceUpdate={handlePriceUpdate} />
      </div>
    </div>
  );
}

export default TradingViewWidget;
