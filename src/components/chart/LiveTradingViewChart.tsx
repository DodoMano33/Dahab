
import React, { useEffect, useState } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';
import { Card, CardContent } from '@/components/ui/card';

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
    
    // مستمع لتحديثات السعر من TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        const price = event.detail.price;
        console.log(`تم استلام تحديث السعر من TradingView: ${price}`);
        setCurrentPrice(price);
        onPriceUpdate?.(price);
      }
    };
    
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      console.log('تم إزالة مكون LiveTradingViewChart');
    };
  }, [onPriceUpdate]);

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 text-center">سعر الذهب الحالي</h3>
        <div className="pb-1">
          <TradingViewWidget symbol={symbol} />
        </div>
        <div className="text-center mt-2">
          {currentPrice && (
            <p className="text-sm text-muted-foreground">
              آخر تحديث للسعر: {currentPrice.toFixed(2)} دولار
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
