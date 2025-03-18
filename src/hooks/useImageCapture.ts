
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
      console.log(`محاولة التقاط صورة جديدة (المحاولة رقم ${captureAttempts + 1})`);
      
      // 1. بحث دقيق عن ويدجيت TradingView
      const widgetElements = document.querySelectorAll('.tradingview-widget-container');
      
      if (widgetElements && widgetElements.length > 0) {
        console.log(`تم العثور على ${widgetElements.length} عنصر للويدجيت مباشرة`);
        
        // استخدم أول ويدجيت وجدناه
        const widgetElement = widgetElements[0];
        
        // انتظر 1 ثانية إضافية للتأكد من تحميل الويدجيت بشكل كامل
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const canvas = await html2canvas(widgetElement as HTMLElement, {
          logging: true,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 2
        });
        
        const imageUrl = canvas.toDataURL('image/png');
        console.log('تم التقاط صورة ويدجيت بنجاح، طول البيانات:', imageUrl.length);
        setCapturedImage(imageUrl);
        
        // إرسال حدث يحتوي على الصورة
        window.dispatchEvent(
          new CustomEvent('widget-image-captured', {
            detail: { imageUrl }
          })
        );
        
        return imageUrl;
      }
      
      // 2. البحث عن المنطقة المستهدفة بشكل مباشر (البحث عن العنصر الذي يحتوي على العنوان "سعر الذهب الحالي")
      const goldPriceSection = document.querySelector('h3.text-lg.font-medium.mb-2.text-center');
      
      if (goldPriceSection) {
        console.log('تم العثور على قسم سعر الذهب الحالي');
        
        // العثور على الكارد الأصلي الذي يحتوي على الويدجيت
        const cardElement = goldPriceSection.closest('.w-full.mb-6');
        
        if (cardElement) {
          console.log('تم العثور على كارد سعر الذهب');
          
          // محاولة العثور على القسم الذي يحتوي على الويدجيت
          const widgetContainer = cardElement.querySelector('.pb-1.flex.justify-center');
          
          if (widgetContainer) {
            console.log('تم العثور على حاوية الويدجيت داخل الكارد');
            
            const canvas = await html2canvas(widgetContainer as HTMLElement, {
              logging: true,
              useCORS: true,
              allowTaint: true,
              backgroundColor: null,
              scale: 2
            });
            
            const imageUrl = canvas.toDataURL('image/png');
            console.log('تم التقاط صورة القسم الذي يحتوي على الويدجيت، طول البيانات:', imageUrl.length);
            setCapturedImage(imageUrl);
            
            return imageUrl;
          }
        }
      }
      
      console.log('لم يتم العثور على أي عنصر مناسب للتقاط الصورة');
      return null;
      
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
      return null;
    }
  }, [captureAttempts]);

  return {
    capturedImage,
    captureAttempts,
    captureTradingViewWidget
  };
};
