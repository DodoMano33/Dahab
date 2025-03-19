
import React, { useState, useEffect } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent } from '@/components/ui/card';
import { fetchGoldPrice } from '@/services/alphaVantageService';
import { Loader2 } from 'lucide-react';

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
  const [alphaVantagePrice, setAlphaVantagePrice] = useState<number | null>(null);
  const [chartPrice, setChartPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  // استماع لتحديثات سعر TradingView
  useEffect(() => {
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        setChartPrice(event.detail.price);
        
        // إرسال تحديث السعر إلى المكون الأب إذا كان متاحًا
        if (onPriceUpdate) {
          onPriceUpdate(event.detail.price);
        }
      }
    };

    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    };
  }, [onPriceUpdate]);

  // استماع لتحديثات سعر Alpha Vantage
  useEffect(() => {
    const handleAlphaVantageUpdate = (event: CustomEvent<{ price: number, timestamp: string }>) => {
      if (event.detail) {
        setAlphaVantagePrice(event.detail.price);
        setLastUpdateTime(event.detail.timestamp);
        
        // إرسال تحديث السعر إلى المكون الأب إذا كان متاحًا
        if (onPriceUpdate) {
          onPriceUpdate(event.detail.price);
        }
        
        // إرسال حدث عام لتحديث السعر في جميع أنحاء التطبيق
        window.dispatchEvent(
          new CustomEvent('global-price-update', {
            detail: { price: event.detail.price, source: 'alphaVantage' }
          })
        );
      }
    };

    window.addEventListener('alpha-vantage-price-update', handleAlphaVantageUpdate as EventListener);
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handleAlphaVantageUpdate as EventListener);
    };
  }, [onPriceUpdate]);

  // جلب سعر Alpha Vantage عند تحميل المكون
  useEffect(() => {
    const loadAlphaVantagePrice = async () => {
      try {
        setIsLoading(true);
        const { price, timestamp } = await fetchGoldPrice();
        setAlphaVantagePrice(price);
        setLastUpdateTime(timestamp);
      } catch (error) {
        console.error("فشل في جلب سعر الذهب من Alpha Vantage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAlphaVantagePrice();
    
    // تحديث السعر كل 5 دقائق
    const intervalId = setInterval(loadAlphaVantagePrice, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 text-center">سعر الذهب الحالي</h3>
        
        {/* عرض سعر Alpha Vantage إذا كان متاحًا */}
        {alphaVantagePrice && (
          <div className="mb-3 bg-green-50 p-2 rounded-md text-center">
            <div className="text-sm font-medium text-green-800">السعر المباشر (Alpha Vantage)</div>
            <div className="text-2xl font-bold text-green-700">{alphaVantagePrice.toFixed(2)} $</div>
            {lastUpdateTime && (
              <div className="text-xs text-green-600 mt-1">آخر تحديث: {lastUpdateTime}</div>
            )}
          </div>
        )}
        
        {/* عرض مؤشر التحميل */}
        {isLoading && !alphaVantagePrice && (
          <div className="flex justify-center items-center mb-3 p-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
            <span className="text-sm">جاري تحميل السعر المباشر...</span>
          </div>
        )}
        
        {/* عرض سعر الرسم البياني إذا كان متاحًا */}
        {chartPrice && (
          <div className="mb-3 bg-blue-50 p-2 rounded-md text-center">
            <div className="text-sm font-medium text-blue-800">سعر الرسم البياني</div>
            <div className="text-lg font-bold text-blue-700">{chartPrice.toFixed(2)} $</div>
          </div>
        )}
        
        <div>
          <TradingViewWidget symbol={symbol} />
        </div>
      </CardContent>
    </Card>
  );
};
