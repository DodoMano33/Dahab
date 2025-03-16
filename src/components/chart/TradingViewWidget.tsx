
import React from 'react';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { TradingViewContainer } from './TradingViewContainer';

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
  const [currentPrice, setCurrentPrice] = React.useState<number | null>(null);
  
  // تثبيت رمز العملة وإضافة مزود السعر بوضوح
  const forcedSymbol = "XAUUSD"; 
  const priceProvider = "CFI";
  
  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);
    onPriceUpdate?.(price);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* الرسم البياني - في حاوية منفصلة */}
      <div className="w-full h-[520px] bg-white dark:bg-gray-800 rounded-t-lg shadow-lg overflow-hidden">
        <TradingViewContainer 
          symbol={forcedSymbol}
          onSymbolChange={onSymbolChange}
          onPriceUpdate={handlePriceUpdate}
        />
      </div>
      
      {/* مستطيل معلومات السعر - منفصل تمامًا عن الشارت */}
      <div className="w-full">
        <CurrentPriceDisplay price={currentPrice} provider={priceProvider} />
      </div>
    </div>
  );
}

export default TradingViewWidget;
