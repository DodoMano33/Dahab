
import React, { useState, useEffect, useRef } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';

export const ExtractedPriceDisplay: React.FC = () => {
  const { currentPrice, priceUpdateCount } = useCurrentPrice();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentPrice !== null) {
      setLastUpdateTime(new Date());
      setIsExtracting(false);
    } else {
      setIsExtracting(true);
    }
  }, [currentPrice]);

  // طلب السعر الحالي عند تحميل المكون
  useEffect(() => {
    window.dispatchEvent(new Event('request-current-price'));
    
    // إضافة مستمع للتحديثات المستمرة
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 1000); // طلب تحديث كل ثانية
    
    return () => clearInterval(intervalId);
  }, []);

  // وظيفة التقاط الصورة من ويدجيت TradingView
  const captureTradingViewWidget = async () => {
    try {
      // البحث عن عنصر ويدجيت TradingView
      const widgetElement = document.querySelector('.tradingview-widget-container');
      
      if (!widgetElement) {
        console.log('لم يتم العثور على ويدجيت TradingView');
        return;
      }
      
      // استخدام html2canvas لالتقاط الصورة
      const canvas = await html2canvas(widgetElement as HTMLElement, {
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2  // جودة أعلى
      });
      
      // تحويل Canvas إلى URL صورة
      const imageUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageUrl);
      
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
    }
  };

  // تنفيذ التقاط الصورة وتحديثها كل ثانية
  useEffect(() => {
    const captureAndUpdate = () => {
      captureTradingViewWidget();
      
      // جدولة التقاط الصورة التالي
      captureTimeoutRef.current = setTimeout(captureAndUpdate, 1000);
    };
    
    // بدء عملية التقاط الصور
    captureAndUpdate();
    
    // تنظيف عند إزالة المكون
    return () => {
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
    };
  }, []);

  // تحويل سنتيمتر إلى بكسل (تقريباً 38 بكسل للسنتيمتر الواحد في معظم الشاشات)
  const widthInPx = 4 * 38;    // 4 سم - تعديل العرض
  const heightInPx = 2.5 * 38; // 2.5 سم - تحديث الارتفاع

  return (
    <div className="w-full">
      <PriceDisplay 
        currentPrice={currentPrice} 
        priceUpdateCount={priceUpdateCount}
        lastUpdateTime={lastUpdateTime}
      />
      {isExtracting && (
        <p className="text-center text-amber-500 text-sm mt-1">
          جاري استخراج السعر الحالي من الصورة...
        </p>
      )}
      
      {/* المستطيل الذي يعرض الصورة الملتقطة من ويدجيت TradingView */}
      <div 
        className={cn(
          "mt-4 mx-auto border-2 border-slate-200 rounded-md",
          "flex items-center justify-center overflow-hidden"
        )}
        style={{ 
          width: `${widthInPx}px`, 
          height: `${heightInPx}px`,
        }}
      >
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="سعر TradingView" 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-sm text-slate-400">جاري التقاط الصورة...</div>
        )}
      </div>
    </div>
  );
};
