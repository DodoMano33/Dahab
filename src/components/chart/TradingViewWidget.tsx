
import React, { useEffect, useState } from 'react';
import { TradingViewContainer } from './TradingViewContainer';

function TradingViewWidget() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handlePriceUpdate = (price: number) => {
    console.log(`تم تحديث السعر في TradingViewWidget: ${price}`);
    setCurrentPrice(price);
    
    // إرسال تحديث أضافي لضمان وصوله إلى جميع أجزاء التطبيق
    window.dispatchEvent(new CustomEvent('price-updated', {
      detail: { price, source: 'tradingview-widget' }
    }));
  };

  // الاستماع لتحديثات السعر الخارجية والتأكد من تحديث الواجهة
  useEffect(() => {
    const handleExternalPriceUpdate = (event: CustomEvent) => {
      if (event.detail?.price && 
          (currentPrice === null || 
           Math.abs(event.detail.price - currentPrice) >= 0.01)) {
        console.log(`تم استلام تحديث سعر خارجي: ${event.detail.price}`);
        setCurrentPrice(event.detail.price);
      }
    };

    window.addEventListener('tradingview-price-update', handleExternalPriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleExternalPriceUpdate as EventListener);
    
    // طلب التحديث الأولي للسعر
    window.dispatchEvent(new CustomEvent('request-current-price'));
    
    // أيضًا نستمع للأحداث المرسلة من قبل المكونات الأخرى في التطبيق
    window.addEventListener('price-updated', handleExternalPriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleExternalPriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleExternalPriceUpdate as EventListener);
      window.removeEventListener('price-updated', handleExternalPriceUpdate as EventListener);
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
