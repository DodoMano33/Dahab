
import React, { useEffect, useState } from 'react';
import { TradingViewContainer } from './TradingViewContainer';

function TradingViewWidget() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handlePriceUpdate = (price: number) => {
    console.log(`تم تحديث السعر في TradingViewWidget: ${price}`);
    setCurrentPrice(price);
    
    // تحديث سعر العنصر بشكل مباشر
    const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
    if (priceElements.length > 0) {
      console.log(`تم العثور على ${priceElements.length} عنصر سعر لتحديثه`);
    }
  };

  // الاستماع لتحديثات السعر الخارجية والتأكد من تحديث الواجهة
  useEffect(() => {
    const handleExternalPriceUpdate = (event: CustomEvent) => {
      if (event.detail?.price && event.detail.price !== currentPrice) {
        setCurrentPrice(event.detail.price);
      }
    };

    window.addEventListener('tradingview-price-update', handleExternalPriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleExternalPriceUpdate as EventListener);
    };
  }, [currentPrice]);

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
