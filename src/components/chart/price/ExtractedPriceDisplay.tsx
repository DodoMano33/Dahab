
import React, { useState, useEffect, useRef } from 'react';
import { PriceDisplay } from '../backtest/components/PriceDisplay';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import Tesseract from 'tesseract.js';

export const ExtractedPriceDisplay: React.FC = () => {
  const { currentPrice, priceUpdateCount, updatePrice } = useCurrentPrice();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [captureAttempts, setCaptureAttempts] = useState<number>(0);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState<boolean>(false);
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

  // استخراج الرقم من النص المستخرج من الصورة
  const extractPriceFromText = (text: string) => {
    console.log('النص المستخرج من الصورة:', text);
    
    // البحث عن نمط الأرقام ذات 4 خانات و3 فواصل عشرية (مثل 2134.567)
    const pricePattern = /\b\d{1,4}[.,]\d{1,3}\b/g;
    const matches = text.match(pricePattern);
    
    console.log('الأرقام المطابقة المستخرجة:', matches);
    
    if (matches && matches.length > 0) {
      // أخذ أول رقم مطابق
      const priceText = matches[0].replace(',', '.');
      const price = parseFloat(priceText);
      
      if (!isNaN(price) && price > 0) {
        console.log('تم استخراج السعر بنجاح:', price);
        setExtractedPrice(price);
        
        // تحديث السعر المستخرج في النظام
        updatePrice(price);
        
        // إرسال حدث تحديث السعر
        window.dispatchEvent(
          new CustomEvent('image-price-update', {
            detail: { price }
          })
        );
        
        return price;
      }
    }
    
    // محاولة بديلة للبحث عن أي رقم في النص
    const anyNumberPattern = /\d+[.,]\d+/g;
    const anyMatches = text.match(anyNumberPattern);
    
    if (anyMatches && anyMatches.length > 0) {
      // ترتيب الأرقام حسب الطول (الأطول أولاً) للعثور على الرقم الأكثر احتمالاً
      const sortedMatches = [...anyMatches].sort((a, b) => b.length - a.length);
      const priceText = sortedMatches[0].replace(',', '.');
      const price = parseFloat(priceText);
      
      if (!isNaN(price) && price > 0) {
        console.log('تم استخراج السعر باستخدام الطريقة البديلة:', price);
        setExtractedPrice(price);
        
        // تحديث السعر المستخرج في النظام
        updatePrice(price);
        
        // إرسال حدث تحديث السعر
        window.dispatchEvent(
          new CustomEvent('image-price-update', {
            detail: { price }
          })
        );
        
        return price;
      }
    }
    
    console.log('فشل في استخراج السعر من النص');
    return null;
  };

  // وظيفة معالجة الصورة باستخدام OCR
  const processImageWithOCR = async (imageUrl: string) => {
    if (isProcessingOCR) return;
    
    try {
      setIsProcessingOCR(true);
      console.log('بدء معالجة الصورة باستخدام OCR...');
      
      // تحديث: إزالة خيار tessedit_char_whitelist غير المدعوم واستخدام خيارات صحيحة فقط
      const result = await Tesseract.recognize(
        imageUrl,
        'eng', // نستخدم اللغة الإنجليزية لاستخراج الأرقام
        { 
          logger: message => console.log('Tesseract:', message)
          // تمت إزالة tessedit_char_whitelist لأنه غير مدعوم في التعريف الحالي للـ WorkerOptions
        }
      );
      
      const extractedText = result.data.text;
      console.log('النص المستخرج من Tesseract:', extractedText);
      setRecognizedText(extractedText);
      
      // استخراج السعر من النص
      const price = extractPriceFromText(extractedText);
      
      return price;
    } catch (error) {
      console.error('خطأ في معالجة الصورة باستخدام OCR:', error);
      return null;
    } finally {
      setIsProcessingOCR(false);
    }
  };

  // وظيفة التقاط الصورة من ويدجيت TradingView
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
          
          // معالجة الصورة باستخدام OCR
          await processImageWithOCR(imageUrl);
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
        
        // معالجة الصورة باستخدام OCR
        await processImageWithOCR(imageUrl);
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
      
      // معالجة الصورة باستخدام OCR
      await processImageWithOCR(imageUrl);
      
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
          
          // معالجة الصورة باستخدام OCR
          await processImageWithOCR(imageUrl);
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
      }, 2000); // التقاط كل 2 ثوان لتقليل الحمل وزيادة فرص نجاح الالتقاط
      
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
        currentPrice={extractedPrice !== null ? extractedPrice : currentPrice} 
        priceUpdateCount={priceUpdateCount}
        lastUpdateTime={lastUpdateTime}
      />
      {isExtracting && (
        <p className="text-center text-amber-500 text-sm mt-1">
          جاري استخراج السعر الحالي من الصورة...
        </p>
      )}
      {isProcessingOCR && (
        <p className="text-center text-amber-500 text-sm mt-1">
          جاري معالجة الصورة لاستخراج السعر...
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
      
      {/* عرض النص المستخرج من الصورة */}
      {recognizedText && (
        <div className="mt-2 text-xs text-center text-gray-600">
          <div>النص المستخرج: <span className="font-mono">{recognizedText}</span></div>
          {extractedPrice && (
            <div className="font-bold text-green-600">
              السعر المستخرج: {extractedPrice.toFixed(2)}
            </div>
          )}
        </div>
      )}
      
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
