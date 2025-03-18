
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
  const [captureAttempts, setCaptureAttempts] = useState<number>(0);
  const widgetRef = useRef<HTMLDivElement | null>(null);

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
      setCaptureAttempts(prev => prev + 1);
      
      // طريقة 1: البحث عن عنصر ويدجت TradingView بالكلاس
      let widgetElement = document.querySelector('.tradingview-widget-container');
      
      // طريقة 2: إذا لم يتم العثور على العنصر بالطريقة الأولى، ابحث عن العنصر بطريقة أخرى
      if (!widgetElement) {
        widgetElement = document.querySelector('[id^="tradingview_"]');
      }
      
      // طريقة 3: محاولة ثالثة باستخدام محدد أكثر عمومية
      if (!widgetElement) {
        widgetElement = document.querySelector('iframe[src*="tradingview.com"]')?.parentElement;
      }
      
      if (!widgetElement) {
        console.log('لم يتم العثور على ويدجيت TradingView بعد ' + captureAttempts + ' محاولات');
        
        // عرض جميع العناصر في الصفحة للمساعدة في تحديد المشكلة
        document.querySelectorAll('div').forEach((el, index) => {
          if (index < 20) { // نعرض فقط أول 20 عنصر لتجنب الإفراط في التسجيل
            console.log(`عنصر div #${index}:`, el.className, el);
          }
        });
        return;
      }
      
      console.log('تم العثور على عنصر TradingView:', widgetElement);
      
      // استخدام html2canvas لالتقاط الصورة
      const canvas = await html2canvas(widgetElement as HTMLElement, {
        logging: true, // تمكين التسجيل للتصحيح
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2  // جودة أعلى
      });
      
      // تحويل Canvas إلى URL صورة
      const imageUrl = canvas.toDataURL('image/png');
      console.log('تم إنشاء الصورة بنجاح، طول البيانات:', imageUrl.length);
      setCapturedImage(imageUrl);
      
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
    }
  };

  // تنفيذ التقاط الصورة وتحديثها بشكل دوري
  useEffect(() => {
    // تأخير أكبر للتأكد من تحميل TradingView بالكامل
    const initialDelay = setTimeout(() => {
      console.log('بدء محاولة التقاط الصورة الأولى...');
      captureTradingViewWidget();
      
      // جدولة التقاط متكرر للصور مع فاصل زمني أطول
      const captureInterval = setInterval(() => {
        captureTradingViewWidget();
      }, 3000); // التقاط كل 3 ثوان لتقليل الحمل وزيادة فرص نجاح الالتقاط
      
      // تنظيف عند إزالة المكون
      return () => {
        clearInterval(captureInterval);
      };
    }, 2500); // تأخير أولي 2.5 ثانية للسماح بتحميل الويدجت بالكامل
    
    return () => {
      clearTimeout(initialDelay);
    };
  }, []);

  // تحويل سنتيمتر إلى بكسل (تقريباً 38 بكسل للسنتيمتر الواحد في معظم الشاشات)
  const widthInPx = 5 * 38;    // 5 سم - تعديل العرض
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
        ref={widgetRef}
      >
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="سعر TradingView" 
            className="object-contain w-full h-full"
            onError={(e) => console.error("خطأ في تحميل الصورة:", e)}
          />
        ) : (
          <div className="text-sm text-slate-400">
            جاري التقاط الصورة... (محاولة #{captureAttempts})
          </div>
        )}
      </div>
      
      {/* إضافة معلومات تشخيصية وزر يدوي لإعادة محاولة التقاط الصورة */}
      <div className="text-center mt-2 space-y-1">
        <button
          onClick={() => captureTradingViewWidget()}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          تحديث الصورة
        </button>
        
        {captureAttempts > 0 && !capturedImage && (
          <p className="text-xs text-red-500">
            لم يتم العثور على ويدجت TradingView بعد {captureAttempts} محاولات
          </p>
        )}
      </div>
    </div>
  );
};
