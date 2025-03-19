
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

interface UseImageCaptureResult {
  captureAttempts: number;
  captureTradingViewWidget: () => Promise<string | null>;
  captureFullScreen: () => Promise<string | null>;
  isCapturing: boolean;
  captureError: string | null;
}

export const useImageCapture = (): UseImageCaptureResult => {
  const [captureAttempts, setCaptureAttempts] = useState<number>(0);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  // التقاط صورة لويدجيت TradingView
  const captureTradingViewWidget = useCallback(async (): Promise<string | null> => {
    try {
      setIsCapturing(true);
      setCaptureError(null);
      setCaptureAttempts(prev => prev + 1);
      console.log(`محاولة التقاط صورة للويدجيت #${captureAttempts + 1}`);
      
      // تحديد العناصر المستهدفة بالترتيب التنازلي حسب الأولوية
      const selectors = [
        '.tradingview-widget-container',
        '.tradingview-widget-wrapper',
        'iframe',
      ];
      
      let targetElement = null;
      
      // البحث عن العناصر حسب ترتيب الأولوية
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        
        if (elements && elements.length > 0) {
          console.log(`تم العثور على ${elements.length} عنصر باستخدام المحدد: ${selector}`);
          targetElement = elements[0] as HTMLElement;
          break;
        }
      }
      
      // إذا لم يتم العثور على أي عنصر محدد، نستخدم حاوية الكارد
      if (!targetElement) {
        console.log("لم يتم العثور على ويدجيت TradingView، محاولة التقاط الصفحة بأكملها");
        return captureFullScreen();
      }
      
      console.log("جاري التقاط صورة للعنصر:", targetElement);
      
      // انتظار وقت قصير لضمان تحميل العناصر
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // استخدام html2canvas مع إعدادات محسنة
      const canvas = await html2canvas(targetElement, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        scrollX: 0,
        scrollY: 0,
      });
      
      // تحويل Canvas إلى URL صورة
      const imageUrl = canvas.toDataURL('image/png');
      console.log('تم إنشاء صورة للويدجيت بنجاح، طول البيانات:', imageUrl.length);
      
      setIsCapturing(false);
      return imageUrl;
      
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
      setCaptureError("حدث خطأ أثناء التقاط صورة الويدجيت");
      
      // محاولة التقاط الصفحة بأكملها كحل بديل
      console.log("محاولة بديلة: التقاط صورة الصفحة بأكملها");
      return captureFullScreen();
    }
  }, [captureAttempts]);

  // التقاط صورة للصفحة بأكملها (سكرين شوت)
  const captureFullScreen = useCallback(async (): Promise<string | null> => {
    try {
      setIsCapturing(true);
      setCaptureError(null);
      setCaptureAttempts(prev => prev + 1);
      console.log(`محاولة التقاط صورة للشاشة الكاملة #${captureAttempts + 1}`);
      
      // انتظار لحظة قصيرة لضمان تحميل جميع العناصر
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // إعدادات محسنة للتقاط صورة الشاشة الكاملة
      const canvas = await html2canvas(document.documentElement, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        x: window.scrollX,
        y: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
        onclone: (documentClone) => {
          // تحسين مظهر الصفحة المستنسخة قبل التقاط الصورة
          const clonedBody = documentClone.body;
          if (clonedBody) {
            clonedBody.style.overflow = 'visible';
          }
        }
      });
      
      // تحويل Canvas إلى URL صورة بجودة عالية
      const imageUrl = canvas.toDataURL('image/png', 1.0);
      console.log('تم إنشاء صورة للشاشة الكاملة بنجاح، طول البيانات:', imageUrl.length);
      
      // إرسال حدث للإعلام بالالتقاط
      window.dispatchEvent(
        new CustomEvent('screen-image-captured', {
          detail: { imageUrl }
        })
      );
      
      setIsCapturing(false);
      return imageUrl;
    } catch (error) {
      console.error('خطأ في التقاط صورة الشاشة الكاملة:', error);
      setCaptureError("فشل التقاط صورة الشاشة الكاملة");
      setIsCapturing(false);
      return null;
    }
  }, [captureAttempts]);

  return {
    captureAttempts,
    captureTradingViewWidget,
    captureFullScreen,
    isCapturing,
    captureError
  };
};
