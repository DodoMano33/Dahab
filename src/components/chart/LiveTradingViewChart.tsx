
import React, { useState, useEffect } from 'react';
import TradingViewWidget from './TradingViewWidget';
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
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    console.log('تم تركيب مكون LiveTradingViewChart');
    
    // نستمع فقط لتحديثات سعر الصورة ولا نقوم باستخراج من الرسم البياني
    const handleGlobalPriceUpdate = (event: CustomEvent<{ price: number, source: string }>) => {
      if (event.detail && event.detail.price && event.detail.source === 'image-processing') {
        console.log(`LiveTradingViewChart: تم استلام تحديث سعر من الصورة:`, event.detail.price);
        setCurrentPrice(event.detail.price);
        setLastUpdateTime(new Date());
        onPriceUpdate?.(event.detail.price);
      }
    };
    
    window.addEventListener('global-price-update', handleGlobalPriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('global-price-update', handleGlobalPriceUpdate as EventListener);
      console.log('تم إزالة مكون LiveTradingViewChart');
    };
  }, [onPriceUpdate]);

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 text-center">سعر الذهب الحالي (عرض الرسم البياني فقط)</h3>
        <div className="pb-1">
          <TradingViewWidget symbol={symbol} />
        </div>
        <div className="text-center mt-2">
          {currentPrice && (
            <div>
              <p className="text-2xl font-bold">
                {currentPrice.toFixed(2)} دولار
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                آخر تحديث: {lastUpdateTime ? new Date(lastUpdateTime).toLocaleTimeString() : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                (السعر مستخرج من الصورة وليس من الرسم البياني)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
