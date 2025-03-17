
import React from 'react';
import { TradingViewContainer } from './TradingViewContainer';

function TradingViewWidget() {
  const handlePriceUpdate = (price: number) => {
    console.log(`تم تحديث السعر في TradingViewWidget: ${price}`);
    
    // السعر يتم بثه تلقائياً لجميع أجزاء التطبيق من خلال TradingViewContainer
    // لذلك لا نحتاج لإعادة بثه هنا
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
