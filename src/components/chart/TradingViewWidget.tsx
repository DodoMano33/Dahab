
import React, { useState, useEffect } from 'react';
import { TradingViewContainer } from './TradingViewContainer';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';

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
  };

  // سجل قابلية عرض المكون
  useEffect(() => {
    console.log('تم تركيب مكون TradingViewWidget');
    return () => console.log('تم إزالة مكون TradingViewWidget');
  }, []);

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
      
      {/* معلومات السعر */}
      <div className="w-full">
        <CurrentPriceDisplay price={currentPrice} provider={priceProvider} />
      </div>
    </div>
  );
}

export default TradingViewWidget;
