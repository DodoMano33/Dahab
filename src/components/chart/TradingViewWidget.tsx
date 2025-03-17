
import React, { useState, useEffect } from 'react';
import { TradingViewContainer } from './TradingViewContainer';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface TradingViewWidgetProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

function TradingViewWidget({ 
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate 
}: TradingViewWidgetProps) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // تثبيت رمز العملة وإضافة مزود السعر بوضوح
  const forcedSymbol = "XAUUSD"; 
  const priceProvider = "CFI";
  
  const handlePriceUpdate = (price: number) => {
    console.log(`تم تحديث السعر في TradingViewWidget: ${price}`);
    setCurrentPrice(price);
    onPriceUpdate?.(price);
    
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
    
    // استخراج السعر المبدئي
    const fetchInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log(`استخراج السعر المبدئي: ${price}`);
        handlePriceUpdate(price);
      }
    };
    
    // تأخير محاولة الاستخراج الأولى للسماح للشارت بالتحميل
    const initialTimeout = setTimeout(fetchInitialPrice, 2000);
    
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
  }, [onPriceUpdate]);

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* عنوان الشارت */}
      <div className="pt-2 pb-1 text-lg font-bold text-white bg-gray-900 text-center rounded-t-lg">
        شارت الذهب (CFI:XAUUSD)
      </div>
      
      {/* الرسم البياني */}
      <div className="w-full h-[520px] bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <TradingViewContainer 
          symbol={forcedSymbol}
          onSymbolChange={onSymbolChange}
          onPriceUpdate={handlePriceUpdate}
        />
      </div>
    </div>
  );
}

export default TradingViewWidget;
