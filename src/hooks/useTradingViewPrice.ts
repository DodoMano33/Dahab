
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
    
    // الويدجيت البسيط - محاولة استخراج السعر من عناصر متعددة
    const priceSelectors = [
      '.tv-ticker-tape-price__value', // محدد أساسي
      'strong', // الويدجيت البسيط يضع السعر في عنصر strong
      'span[data-field="last"]', // محدد بديل
      '.price-value',  // محدد بديل
      '[data-name="legend-series-item"] [data-name="legend-value-item"]', // محدد بديل
      '.tv-symbol-price-quote__value', // محدد بديل
      '[data-field="last"]', // محدد بديل
      '.tv-symbol-header__first-line', // محدد بديل
      '.apply-common-tooltip' // محدد بديل
    ];
    
    // سجل عدد العناصر التي تم العثور عليها لكل محدد
    for (const selector of priceSelectors) {
      const elements = containerRef.current.querySelectorAll(selector);
      console.log(`البحث باستخدام المحدد '${selector}'، تم العثور على ${elements.length} عنصر`);
      
      for (const element of elements) {
        const priceText = element.textContent;
        if (priceText) {
          console.log(`النص المستخرج: "${priceText}"`);
          // تنظيف النص لاستخراج الأرقام
          const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
          
          if (cleanText.match(/\d+([.,]\d+)?/)) {
            const normalizedText = cleanText.replace(/,/g, '.');
            const price = parseFloat(normalizedText);
            
            if (!isNaN(price) && price > 0) {
              // التحقق من نطاق سعر الذهب - حاليًا بين 2000-4000
              if (price > 2000 && price < 4000) {
                console.log(`تم استخراج سعر ذهب: ${price} من محدد ${selector}`);
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
    
    // محاولة البحث في عناصر مخصصة أخرى للعثور على السعر
    console.log("محاولة البحث عن السعر في عناصر أخرى...");
    let headers = ['h1', 'h2', 'h3', '.price', 'strong', 'b', '.value'];
    for (const selector of headers) {
      const elements = document.querySelectorAll(selector);
      console.log(`البحث باستخدام المحدد '${selector}'، تم العثور على ${elements.length} عنصر`);
      
      for (const element of elements) {
        const text = element.textContent;
        if (text) {
          console.log(`النص المستخرج: "${text}"`);
        }
      }
    }
    
    // محاولة أخيرة - استخراج السعر من النص الكامل للصفحة
    const allText = document.body.textContent || '';
    
    // نمط للبحث عن أرقام تشبه أسعار الذهب (مثلاً 2,345.67 أو 3045.12)
    const goldPattern1 = /\b[23],\d{3}\.\d{1,3}\b/g; // نمط مثل "3,065.48"
    const goldPattern2 = /\b[23]\d{3}\.\d{1,3}\b/g;  // نمط مثل "3065.48"
    
    const matches1 = allText.match(goldPattern1);
    if (matches1 && matches1.length > 0) {
      for (const match of matches1) {
        const price = parseFloat(match.replace(/,/g, ''));
        if (!isNaN(price) && price > 2000 && price < 4000) {
          console.log(`تم استخراج سعر من نص الصفحة (نمط مع فاصلة): ${price}`);
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
    
    const matches2 = allText.match(goldPattern2);
    if (matches2 && matches2.length > 0) {
      for (const match of matches2) {
        const price = parseFloat(match);
        if (!isNaN(price) && price > 2000 && price < 4000) {
          console.log(`تم استخراج سعر من نص الصفحة (نمط 3000+): ${price}`);
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

  // تنظيف الفواصل الزمنية عند إزالة المكون
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

  // إعداد استخراج السعر
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
    }, 1000) as unknown as number; // تحديث كل ثانية للحصول على أحدث سعر
  }, [extractPriceFromWidget]);

  return {
    setupPriceExtraction,
    extractPriceFromWidget,
    isWidgetLoaded: widgetLoadedRef.current
  };
};
