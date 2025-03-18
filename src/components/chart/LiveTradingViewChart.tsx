
import React, { useEffect, useState } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent } from '@/components/ui/card';
import html2canvas from 'html2canvas';

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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // استخراج السعر من الويدجيت مباشرة
  const captureWidgetImage = async () => {
    try {
      const widgetElement = document.querySelector('.tradingview-widget-container');
      if (!widgetElement) {
        console.log('لم يتم العثور على ويدجيت TradingView');
        return null;
      }
      
      const canvas = await html2canvas(widgetElement as HTMLElement, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      console.log('تم التقاط صورة الويدجيت بنجاح، طول البيانات:', imageUrl.length);
      setCapturedImage(imageUrl);
      
      // إرسال حدث يحتوي على الصورة
      window.dispatchEvent(
        new CustomEvent('widget-image-captured', {
          detail: { imageUrl }
        })
      );
      
      return imageUrl;
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('تم تركيب مكون LiveTradingViewChart');
    
    // استخراج السعر المبدئي باستخدام OCR
    const captureInitialImage = async () => {
      // التقاط صورة الويدجيت بعد تحميله
      setTimeout(() => {
        captureWidgetImage();
      }, 1500);
    };
    
    captureInitialImage();
    
    // مستمع لتحديثات السعر من OCR
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        const price = event.detail.price;
        console.log(`تم استلام تحديث السعر من OCR: ${price}`);
        setCurrentPrice(price);
        setLastUpdateTime(new Date());
        onPriceUpdate?.(price);
      }
    };
    
    // مستمع لطلبات السعر الحالي
    const handleRequestCurrentPrice = () => {
      if (currentPrice) {
        console.log("تم استلام طلب للسعر الحالي، إرسال:", currentPrice);
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
      captureWidgetImage();
    };
    
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-current-price', handleRequestCurrentPrice);
    window.addEventListener('request-capture-widget', handleRequestCapture as EventListener);
    
    // جدولة التقاط الصورة بشكل دوري
    const captureInterval = setInterval(() => {
      captureWidgetImage();
    }, 5000); // التقاط كل 5 ثوانٍ
    
    return () => {
      clearInterval(captureInterval);
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handleRequestCurrentPrice);
      window.removeEventListener('request-capture-widget', handleRequestCapture as EventListener);
      console.log('تم إزالة مكون LiveTradingViewChart');
    };
  }, [onPriceUpdate, currentPrice]);

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 text-center">سعر الذهب الحالي</h3>
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
              <button 
                className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                onClick={captureWidgetImage}
              >
                تحديث السعر
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
