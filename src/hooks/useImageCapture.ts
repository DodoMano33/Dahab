
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

interface UseImageCaptureResult {
  capturedImage: string | null;
  captureAttempts: number;
  captureTradingViewWidget: () => Promise<string | null>;
}

export const useImageCapture = (): UseImageCaptureResult => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [captureAttempts, setCaptureAttempts] = useState<number>(0);

  const captureTradingViewWidget = useCallback(async (): Promise<string | null> => {
    try {
      setCaptureAttempts(prev => prev + 1);
      
      // تحديد المنطقة المستهدفة بشكل مباشر (البحث عن العنصر الذي يحتوي على العنوان "سعر الذهب الحالي")
      const goldPriceSection = document.querySelector('h3.text-lg.font-medium.mb-2.text-center');
      
      if (!goldPriceSection) {
        console.log('لم يتم العثور على قسم سعر الذهب الحالي');
        return null;
      }
      
      // العثور على الكارد الأصلي الذي يحتوي على الويدجيت
      const cardElement = goldPriceSection.closest('.w-full.mb-6');
      
      if (!cardElement) {
        console.log('لم يتم العثور على كارد سعر الذهب');
        return null;
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
          
          return imageUrl;
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
        
        return imageUrl;
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
      
      return imageUrl;
      
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
          
          return imageUrl;
        }
      } catch (secondError) {
        console.error('فشلت المحاولة البديلة أيضًا:', secondError);
      }
      
      return null;
    }
  }, []);

  return {
    capturedImage,
    captureAttempts,
    captureTradingViewWidget
  };
};
