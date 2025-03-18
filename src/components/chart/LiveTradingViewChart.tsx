
import React, { useEffect, useState, useRef } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';
import { Card, CardContent } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { useImageCapture } from '@/hooks/useImageCapture';

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
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const { capturedImage, captureTradingViewWidget } = useImageCapture();

  useEffect(() => {
    console.log('تم تركيب مكون LiveTradingViewChart');
    
    // استخراج السعر المبدئي
    const fetchInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log(`تم استخراج السعر المبدئي: ${price}`);
        setCurrentPrice(price);
        setLastUpdateTime(new Date());
        onPriceUpdate?.(price);
        
        // إرسال حدث تحديث السعر لباقي المكونات في التطبيق
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price }
          })
        );
      }
      
      // التقاط صورة الويدجيت بعد تحميله
      setTimeout(async () => {
        await captureTradingViewWidget();
      }, 3000);
    };
    
    fetchInitialPrice();
    
    // مستمع لتحديثات السعر من TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        const price = event.detail.price;
        console.log(`تم استلام تحديث السعر من TradingView: ${price}`);
        setCurrentPrice(price);
        setLastUpdateTime(new Date());
        onPriceUpdate?.(price);
        
        // التقاط صورة جديدة عند تغير السعر (مرة كل 10 ثوانٍ كحد أقصى)
        const now = new Date();
        const lastUpdate = lastUpdateTime || new Date(0);
        if (now.getTime() - lastUpdate.getTime() > 10000) {
          captureTradingViewWidget();
        }
      }
    };
    
    // مستمع لطلبات السعر الحالي
    const handleRequestCurrentPrice = () => {
      if (currentPrice) {
        console.log("تم استلام طلب للسعر الحالي، إرسال:", currentPrice);
        window.dispatchEvent(
          new CustomEvent('current-price-response', {
            detail: { price: currentPrice }
          })
        );
        
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price: currentPrice }
          })
        );
      }
    };
    
    // مستمع لطلبات التقاط الصورة
    const handleRequestCapture = () => {
      console.log("تم استلام طلب لالتقاط صورة الويدجيت");
      captureTradingViewWidget();
    };
    
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-current-price', handleRequestCurrentPrice);
    window.addEventListener('request-capture-widget', handleRequestCapture);
    
    // تعديل الفاصل الزمني إلى 5 ثوانٍ
    const priceExtractInterval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null && price !== currentPrice) {
        console.log(`تم تحديث السعر تلقائيًا: ${price}`);
        setCurrentPrice(price);
        setLastUpdateTime(new Date());
        onPriceUpdate?.(price);
        
        // التقاط صورة عند تغير السعر
        captureTradingViewWidget();
        
        // إرسال حدث تحديث السعر لباقي المكونات
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price }
          })
        );
      }
    }, 5000); // تحديث كل 5 ثوانٍ
    
    return () => {
      clearInterval(priceExtractInterval);
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handleRequestCurrentPrice);
      window.removeEventListener('request-capture-widget', handleRequestCapture);
      console.log('تم إزالة مكون LiveTradingViewChart');
    };
  }, [onPriceUpdate, currentPrice, lastUpdateTime, captureTradingViewWidget]);

  return (
    <Card className="w-full mb-6" ref={widgetRef}>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 text-center">سعر الذهب الحالي</h3>
        <div className="pb-1 flex justify-center" style={{ height: '95px' }}>
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
              <button 
                className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                onClick={() => captureTradingViewWidget()}
              >
                تحديث السعر
              </button>
            </div>
          )}
          {capturedImage && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">الصورة الملتقطة للويدجيت:</p>
              <div className="border border-gray-200 rounded p-1 inline-block max-w-full">
                <img 
                  src={capturedImage} 
                  alt="صورة ويدجيت التداول" 
                  className="max-w-full h-auto"
                  style={{ maxHeight: '100px' }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
