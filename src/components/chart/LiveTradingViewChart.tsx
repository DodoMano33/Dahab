
import React, { useEffect, useState } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate
}) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    console.log('تم تركيب مكون LiveTradingViewChart');
    
    // استخراج السعر المبدئي
    const fetchInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log(`تم استخراج السعر المبدئي: ${price}`);
        setCurrentPrice(price);
        onPriceUpdate?.(price);
      }
    };
    
    fetchInitialPrice();
    
    // جدولة تحديث دوري
    const interval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log(`تم تحديث السعر: ${price}`);
        setCurrentPrice(price);
        onPriceUpdate?.(price);
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      console.log('تم إزالة مكون LiveTradingViewChart');
    };
  }, [onPriceUpdate]);

  const handlePriceUpdate = (price: number) => {
    console.log(`LiveTradingViewChart استلم تحديث السعر: ${price}`);
    setCurrentPrice(price);
    onPriceUpdate?.(price);
  };

  return (
    <div className="w-full mb-6">
      <div className="p-1 bg-gray-800 rounded-lg">
        <TradingViewWidget 
          symbol="XAUUSD"
          onSymbolChange={onSymbolChange}
          onPriceUpdate={handlePriceUpdate}
        />
      </div>
      
      {/* إزالة عرض السعر المكرر من هنا */}
    </div>
  );
};
