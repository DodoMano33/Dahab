
import { useRef, useEffect, useCallback } from 'react';

/**
 * هوك مخصص للتعامل مع استخراج السعر من ويدجيت TradingView
 */
export const useTradingViewPrice = (containerRef: React.RefObject<HTMLDivElement>) => {
  const intervalRef = useRef<number | null>(null);
  const lastExtractedPrice = useRef<number | null>(null);
  const widgetLoadedRef = useRef<boolean>(false);
  const extractionAttemptsRef = useRef<number>(0);

  // دالة محسنة لاستخراج السعر من الويدجيت البسيط
  const extractPriceFromWidget = useCallback(() => {
    if (!containerRef.current || !widgetLoadedRef.current) return;
    
    // حد لعدد محاولات الاستخراج
    if (extractionAttemptsRef.current > 30 && lastExtractedPrice.current !== null) {
      console.log("تم الوصول للحد الأقصى من محاولات استخراج السعر، استخدام آخر سعر معروف");
      return;
    }
    
    extractionAttemptsRef.current++;
    
    // الويدجيت البسيط - يظهر السعر في عنصر strong
    const priceSelectors = [
      'strong', // الويدجيت البسيط يضع السعر في عنصر strong
      '.tv-ticker-tape-price__value', // احتياطي
      '.tv-symbol-price-quote__value', // احتياطي
      '[data-field="last"]', // احتياطي
      '.price-value',  // احتياطي
      '.tv-symbol-header__first-line', // احتياطي
      '.apply-common-tooltip' // احتياطي
    ];
    
    // البحث عن عنصر السعر باستخدام المحددات
    for (const selector of priceSelectors) {
      const elements = containerRef.current.querySelectorAll(selector);
      
      if (elements && elements.length > 0) {
        for (const element of elements) {
          const priceText = element.textContent;
          if (priceText) {
            const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
            
            if (cleanText.match(/\d+([.,]\d+)?/)) {
              const normalizedText = cleanText.replace(/,/g, '.');
              const price = parseFloat(normalizedText);
              
              if (!isNaN(price) && price > 0) {
                // التحقق من نطاق سعر الذهب - حاليًا بين 2000-4000
                if (price > 2000 && price < 4000) {
                  if (price !== lastExtractedPrice.current) {
                    console.log(`تم استخراج سعر ذهب جديد: ${price}`);
                    lastExtractedPrice.current = price;
                    
                    // إرسال حدث مخصص بالسعر المستخرج
                    window.dispatchEvent(
                      new CustomEvent('tradingview-price-update', {
                        detail: { price }
                      })
                    );
                  }
                  return;
                }
              }
            }
          }
        }
      }
    }
    
    // البحث عن نمط السعر في نص الويدجيت بالكامل
    const allText = containerRef.current.textContent || '';
    const pricePattern = /\b[23],\d{3}\.\d{1,3}\b/g; // نمط مثل "3,030.51"
    const matches = allText.match(pricePattern);
    
    if (matches && matches.length > 0) {
      for (const match of matches) {
        const price = parseFloat(match.replace(/,/g, ''));
        if (!isNaN(price) && price > 2000 && price < 4000) {
          console.log(`تم استخراج سعر من نص كامل الويدجيت: ${price}`);
          
          if (price !== lastExtractedPrice.current) {
            lastExtractedPrice.current = price;
            
            window.dispatchEvent(
              new CustomEvent('tradingview-price-update', {
                detail: { price }
              })
            );
          }
          return;
        }
      }
    }
  }, [containerRef]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      widgetLoadedRef.current = false;
      extractionAttemptsRef.current = 0;
    };
  }, []);

  const setupPriceExtraction = useCallback(() => {
    console.log("إعداد استخراج السعر من ويدجيت TradingView");
    
    widgetLoadedRef.current = true;
    extractionAttemptsRef.current = 0;
    
    // تأخير أطول للتأكد من تحميل الويدجيت بالكامل
    setTimeout(() => {
      if (widgetLoadedRef.current) {
        extractPriceFromWidget();
        
        // طلب التقاط صورة للويدجيت بعد تحميله
        window.dispatchEvent(new Event('request-capture-widget'));
      }
    }, 2000);
    
    // إعداد فاصل زمني لتحديث السعر
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (widgetLoadedRef.current) {
        extractPriceFromWidget();
      }
    }, 2000) as unknown as number; // زيادة الفاصل الزمني إلى 2 ثانية
  }, [extractPriceFromWidget]);

  return {
    setupPriceExtraction,
    extractPriceFromWidget,
    isWidgetLoaded: widgetLoadedRef.current
  };
};
