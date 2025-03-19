
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

interface UseImageCaptureResult {
  captureAttempts: number;
  captureTradingViewWidget: () => Promise<string | null>;
}

export const useImageCapture = (): UseImageCaptureResult => {
  const [captureAttempts, setCaptureAttempts] = useState<number>(0);

  const captureTradingViewWidget = useCallback(async (): Promise<string | null> => {
    try {
      setCaptureAttempts(prev => prev + 1);
      console.log(`محاولة التقاط صورة #${captureAttempts + 1}`);
      
      // تحديد العناصر المستهدفة بالترتيب التنازلي حسب الأولوية
      const selectors = [
        '.tradingview-widget-container',
        '.tradingview-widget-wrapper',
        '.tv-ticker-tape-wrapper',
        'h3.text-lg:contains("سعر الذهب") + div',
        'div:contains("3")'
      ];
      
      let targetElement = null;
      
      // البحث عن العناصر حسب ترتيب الأولوية
      for (const selector of selectors) {
        let elements;
        if (selector.includes(':contains')) {
          // معالجة خاصة لـ :contains
          const [tag, searchText] = selector.split(':contains(');
          const text = searchText.replace(/[")]/g, '');
          const allElements = document.querySelectorAll(tag);
          elements = Array.from(allElements).filter(el => 
            el.textContent && el.textContent.includes(text)
          );
        } else {
          elements = document.querySelectorAll(selector);
        }
        
        if (elements && elements.length > 0) {
          console.log(`تم العثور على ${elements.length} عنصر باستخدام المحدد: ${selector}`);
          targetElement = elements[0] as HTMLElement;
          break;
        }
      }
      
      // إذا لم يتم العثور على أي عنصر محدد مسبقًا، نبحث عن أي حاوية تحتوي على سعر الذهب
      if (!targetElement) {
        console.log("البحث عن أي حاوية تحتوي على سعر الذهب");
        const textNodes = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let node;
        while (node = textNodes.nextNode()) {
          const text = node.textContent || '';
          if (text.match(/\b[23]\d{3}\.\d{1,2}\b/) || text.match(/\b[23],\d{3}\.\d{1,2}\b/)) {
            let parent = node.parentElement;
            for (let i = 0; i < 5 && parent; i++) { // نصعد حتى 5 مستويات للعثور على حاوية مناسبة
              if (parent.clientWidth > 100 && parent.clientHeight > 50) {
                console.log("تم العثور على حاوية محتملة تحتوي على سعر الذهب:", parent);
                targetElement = parent;
                break;
              }
              parent = parent.parentElement;
            }
            if (targetElement) break;
          }
        }
      }
      
      // إذا لم نعثر على أي عنصر محدد، نستخدم حاوية الكارد
      if (!targetElement) {
        console.log("لم يتم العثور على أي عنصر محدد، استخدام حاوية الكارد");
        targetElement = document.querySelector('.w-full.mb-6') as HTMLElement;
      }
      
      // إذا لم نتمكن من العثور على أي عنصر، نخرج
      if (!targetElement) {
        console.log("لم يتم العثور على أي عنصر مناسب للالتقاط");
        return null;
      }
      
      console.log("التقاط صورة للعنصر:", targetElement);
      
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
      
      return imageUrl;
      
    } catch (error) {
      console.error('خطأ في التقاط صورة ويدجيت TradingView:', error);
      
      // محاولة أخيرة - التقاط الصورة مباشرة من جسم الصفحة
      try {
        console.log("محاولة أخيرة: التقاط قسم من الصفحة");
        const viewport = document.createElement('div');
        viewport.style.position = 'absolute';
        viewport.style.top = '0';
        viewport.style.left = '0';
        viewport.style.width = '300px';
        viewport.style.height = '150px';
        viewport.style.overflow = 'hidden';
        document.body.appendChild(viewport);
        
        const canvas = await html2canvas(document.body, {
          logging: true,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 1,
          x: 0,
          y: 0,
          width: 300,
          height: 150
        });
        
        document.body.removeChild(viewport);
        
        const imageUrl = canvas.toDataURL('image/png');
        console.log('تم التقاط قسم من الصفحة، طول البيانات:', imageUrl.length);
        
        window.dispatchEvent(
          new CustomEvent('widget-image-captured', {
            detail: { imageUrl }
          })
        );
        
        return imageUrl;
      } catch (secondError) {
        console.error('فشلت المحاولة البديلة أيضًا:', secondError);
      }
      
      return null;
    }
  }, [captureAttempts]);

  return {
    captureAttempts,
    captureTradingViewWidget
  };
};
