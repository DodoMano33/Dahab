
import React, { useState, useEffect } from 'react';
import { TradingViewContainer } from './TradingViewContainer';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

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

  // محاولة استخراج السعر بشكل دوري
  useEffect(() => {
    console.log('تم تركيب مكون TradingViewWidget');
    
    // استخراج السعر المبدئي بعد فترة قصيرة للسماح للشارت بالتحميل
    const fetchInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log(`استخراج السعر المبدئي: ${price}`);
        handlePriceUpdate(price);
      }
    };
    
    // تأخير محاولة الاستخراج الأولى للسماح للشارت بالتحميل
    const initialTimeout = setTimeout(fetchInitialPrice, 5000);
    
    // جدولة تحديثات دورية
    const interval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log(`استخراج السعر الدوري: ${price}`);
        handlePriceUpdate(price);
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
      console.log('تم إزالة مكون TradingViewWidget');
    };
  }, []);

  return (
    <div className="flex flex-col w-full space-y-2">
      {/* عنوان الشارت */}
      <div className="py-2 text-lg font-bold text-white bg-gray-900 text-center rounded-t-lg">
        الذهب (CFI:XAUUSD)
      </div>
      
      {/* الرسم البياني */}
      <div className="w-full h-[500px] bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <TradingViewContainer onPriceUpdate={handlePriceUpdate} />
      </div>
      
      {/* عرض السعر الحالي */}
      <div className="bg-gray-900 text-white p-4 rounded-lg flex justify-center items-center">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
          <span className="text-gray-300 mr-2">سعر الذهب:</span>
        </div>
        <span className="font-bold text-2xl text-yellow-500" id="stats-price-display">
          {currentPrice ? currentPrice.toFixed(2) : "جاري التحميل..."}
        </span>
        <span className="text-gray-300 text-sm ml-2">USD</span>
      </div>
    </div>
  );
}

export default TradingViewWidget;
