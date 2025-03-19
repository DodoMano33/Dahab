
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

interface UseImageCaptureResult {
  captureAttempts: number;
  captureTradingViewWidget: () => Promise<string | null>;
  isCapturing: boolean;
  captureError: string | null;
}

export const useImageCapture = (): UseImageCaptureResult => {
  const [captureAttempts, setCaptureAttempts] = useState<number>(0);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const captureTradingViewWidget = useCallback(async (): Promise<string | null> => {
    try {
      setIsCapturing(true);
      setCaptureError(null);
      setCaptureAttempts(prev => prev + 1);
      console.log(`محاولة التقاط صورة #${captureAttempts + 1}`);
      
      // تحديد العناصر المستهدفة بالترتيب التنازلي حسب الأولوية
      const selectors = [
        '.tradingview-widget-container',
        '.tradingview-widget-wrapper',
        '.tv-ticker-tape-wrapper',
        'iframe',
        '.tradingview-widget-container iframe'
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
        console.log("محاولة البحث عن عناصر أخرى...");
        targetElement = document.querySelector('.tradingview-widget-wrapper') as HTMLElement ||
                       document.querySelector('iframe') as HTMLElement;
      }
      
      // إذا لم نتمكن من العثور على أي عنصر، محاولة التقاط الصفحة بأكملها
      if (!targetElement) {
        console.log("لم يتم العثور على أي عنصر مناسب، التقاط الصفحة بأكملها");
        try {
          const canvas = await html2canvas(document.documentElement, {
            logging: true,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scale: 1
          });
          
          const imageUrl = canvas.toDataURL('image/png');
          setIsCapturing(false);
          return imageUrl;
        } catch (fullPageError) {
          console.error("فشل التقاط الصفحة بأكملها:", fullPageError);
          setCaptureError("فشل التقاط الصفحة");
          setIsCapturing(false);
          return null;
        }
      }
      
      console.log("التقاط صورة للعنصر:", targetElement);
      
      // محاولة خاصة للإطار الداخلي
      if (targetElement.tagName === 'IFRAME') {
        try {
          const iframe = targetElement as HTMLIFrameElement;
          console.log("محاولة التقاط محتوى الإطار الداخلي:", iframe.src);
          
          // عنصر الكانفاس للتصوير
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // ضبط أبعاد الكانفاس
          canvas.width = iframe.offsetWidth * 2;  // مضاعفة للحصول على دقة أفضل
          canvas.height = iframe.offsetHeight * 2;
          
          // تعبئة الخلفية
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // إنشاء صورة وتعيين المصدر للإطار
            const img = new Image();
            
            // الانتظار لتحميل الإطار بالكامل
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            // محاولة الحصول على لقطة شاشة باستخدام html2canvas
            const iframeCanvas = await html2canvas(iframe, {
              useCORS: true,
              allowTaint: true,
              scale: 2,
              logging: true,
            });
            
            // رسم محتوى الإطار على الكانفاس
            ctx.drawImage(iframeCanvas, 0, 0, canvas.width, canvas.height);
            
            // تحويل الكانفاس إلى URL صورة
            const imageUrl = canvas.toDataURL('image/png');
            console.log('تم إنشاء صورة الإطار الداخلي بنجاح، طول البيانات:', imageUrl.length);
            
            setIsCapturing(false);
            return imageUrl;
          }
        } catch (iframeError) {
          console.error("خطأ في التقاط الإطار الداخلي:", iframeError);
        }
      }
      
      // استخدام html2canvas لالتقاط الصورة
      const canvas = await html2canvas(targetElement, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2
      });
      
      // تحويل Canvas إلى URL صورة
      const imageUrl = canvas.toDataURL('image/png');
      console.log('تم إنشاء الصورة بنجاح، طول البيانات:', imageUrl.length);
      
      // إرسال حدث للإعلام بالالتقاط
      window.dispatchEvent(
        new CustomEvent('widget-image-captured', {
          detail: { imageUrl }
        })
      );
      
      setIsCapturing(false);
      return imageUrl;
      
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
      setCaptureError("حدث خطأ أثناء التقاط الصورة");
      
      // محاولة أخيرة - التقاط الصورة مباشرة من أي عنصر مرئي
      try {
        console.log("محاولة أخيرة: التقاط صورة الصفحة بأكملها");
        const canvas = await html2canvas(document.documentElement, {
          logging: true,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scale: 1
        });
        
        const imageUrl = canvas.toDataURL('image/png');
        console.log('تم التقاط صورة الصفحة، طول البيانات:', imageUrl.length);
        
        setIsCapturing(false);
        return imageUrl;
      } catch (secondError) {
        console.error('فشلت المحاولة البديلة أيضًا:', secondError);
      }
      
      setIsCapturing(false);
      return null;
    }
  }, [captureAttempts]);

  return {
    captureAttempts,
    captureTradingViewWidget,
    isCapturing,
    captureError
  };
};
