
import React, { useEffect, useState } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { DebugButton } from './debug/DebugButton';

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
  const [captureAttempts, setCaptureAttempts] = useState(0);

  // استخراج السعر من الويدجيت مباشرة
  const captureWidgetImage = async () => {
    try {
      setCaptureAttempts(prev => prev + 1);
      console.log(`محاولة التقاط صورة #${captureAttempts + 1}`);
      
      const widgetElement = document.querySelector('.tradingview-widget-container');
      if (!widgetElement) {
        console.log('لم يتم العثور على ويدجيت TradingView');
        return null;
      }
      
      // تأخير قصير لضمان أن الويدجيت قد تم تحميله بالكامل
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // تحسين جودة الصورة الملتقطة
      const canvas = await html2canvas(widgetElement as HTMLElement, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 3, // زيادة دقة الصورة
        imageTimeout: 0, // تعطيل المهلة
      });
      
      const imageUrl = canvas.toDataURL('image/png', 1.0); // جودة أعلى للصورة
      console.log('تم التقاط صورة الويدجيت بنجاح، طول البيانات:', imageUrl.length);
      
      // طباعة حجم الصورة للتشخيص
      console.log(`أبعاد الصورة الملتقطة: ${canvas.width}x${canvas.height}`);
      
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
    
    // استخراج السعر المبدئي باستخدام OCR بعد تحميل الويدجيت
    const captureInitialImage = async () => {
      // التقاط صورة الويدجيت بعد تحميله بوقت كافي
      setTimeout(() => {
        console.log("محاولة التقاط الصورة الأولية...");
        captureWidgetImage();
      }, 3000);
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
    
    // جدولة التقاط الصورة بشكل دوري (تقليل التواتر لتجنب التحميل الزائد)
    const captureInterval = setInterval(() => {
      captureWidgetImage();
    }, 10000); // التقاط كل 10 ثوانٍ
    
    return () => {
      clearInterval(captureInterval);
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handleRequestCurrentPrice);
      window.removeEventListener('request-capture-widget', handleRequestCapture as EventListener);
      console.log('تم إزالة مكون LiveTradingViewChart');
    };
  }, [onPriceUpdate, currentPrice, captureAttempts]);

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-center">سعر الذهب الحالي</h3>
          <DebugButton />
        </div>
        <div className="pb-1">
          <TradingViewWidget symbol={symbol} />
        </div>
        <div className="text-center mt-2">
          {currentPrice ? (
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
          ) : (
            <div>
              <p className="text-amber-500">جارٍ استخراج السعر...</p>
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
