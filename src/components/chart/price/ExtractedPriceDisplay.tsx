
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

  // وظيفة التقاط الصورة من ويدجيت TradingView (محدث للجزء المعلم باللون الأحمر)
  const captureTradingViewWidget = async () => {
    try {
      setCaptureAttempts(prev => prev + 1);
      
      // تحديد المنطقة المستهدفة بشكل مباشر (البحث عن العنصر الذي يحتوي على العنوان "سعر الذهب الحالي")
      const goldPriceSection = document.querySelector('h3.text-lg.font-medium.mb-2.text-center');
      
      if (!goldPriceSection) {
        console.log('لم يتم العثور على قسم سعر الذهب الحالي');
        return;
      }
      
      // العثور على الكارد الأصلي الذي يحتوي على الويدجيت
      const cardElement = goldPriceSection.closest('.w-full.mb-6');
      
      if (!cardElement) {
        console.log('لم يتم العثور على كارد سعر الذهب');
        return;
      }
      
      // البحث عن الويدجيت نفسه داخل الكارد (المنطقة المحددة باللون الأحمر)
      const widgetContainer = cardElement.querySelector('.tv-ticker-tape-wrapper') || 
                             cardElement.querySelector('.tradingview-widget-container');
      
      if (!widgetContainer) {
        console.log('لم يتم العثور على ويدجيت TradingView داخل الكارد');
        
        // محاولة أخرى للعثور على أي عنصر داخل الكارد يمكن أن يكون الويدجيت
        const anyPossibleWidget = cardElement.querySelector('div:not(.text-center)');
        
        if (!anyPossibleWidget) {
          console.log('لم يتم العثور على أي عنصر يمكن أن يكون الويدجيت');
          
          // في حالة الفشل، نعرض الكارد بالكامل
          console.log('محاولة التقاط الكارد بالكامل كحل بديل');
          const canvas = await html2canvas(cardElement as HTMLElement, {
            logging: true,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scale: 2
          });
          
          const imageUrl = canvas.toDataURL('image/png');
          console.log('تم التقاط صورة الكارد بالكامل، طول البيانات:', imageUrl.length);
          setCapturedImage(imageUrl);
          return;
        }
        
        console.log('محاولة التقاط أي عنصر محتمل داخل الكارد');
        const canvas = await html2canvas(anyPossibleWidget as HTMLElement, {
          logging: true,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 2
        });
        
        const imageUrl = canvas.toDataURL('image/png');
        console.log('تم التقاط صورة للعنصر المحتمل، طول البيانات:', imageUrl.length);
        setCapturedImage(imageUrl);
        return;
      }
      
      console.log('تم العثور على ويدجيت TradingView:', widgetContainer);
      
      // استخدام html2canvas لالتقاط الصورة
      const canvas = await html2canvas(widgetContainer as HTMLElement, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2
      });
      
      // تحويل Canvas إلى URL صورة
      const imageUrl = canvas.toDataURL('image/png');
      console.log('تم إنشاء الصورة بنجاح، طول البيانات:', imageUrl.length);
      setCapturedImage(imageUrl);
      
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
      
      // محاولة بديلة - التقاط الصورة من TradingViewWidget مباشرة
      try {
        // عنصر من مكون TradingViewWidget نفسه
        const directWidgetElement = document.querySelector('.tradingview-widget-container');
        
        if (directWidgetElement) {
          console.log('محاولة بديلة: التقاط الويدجيت مباشرة');
          const canvas = await html2canvas(directWidgetElement as HTMLElement, {
            logging: true,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scale: 2
          });
          
          const imageUrl = canvas.toDataURL('image/png');
          console.log('محاولة بديلة ناجحة، طول البيانات:', imageUrl.length);
          setCapturedImage(imageUrl);
          return;
        }
      } catch (secondError) {
        console.error('فشلت المحاولة البديلة أيضًا:', secondError);
      }
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
