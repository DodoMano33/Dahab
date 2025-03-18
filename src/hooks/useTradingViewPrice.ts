
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
    
    // محاولة استخراج السعر مباشرة من ويدجيت TradingView
    try {
      const widgetContainer = containerRef.current.querySelector('.tradingview-widget-container');
      if (!widgetContainer) {
        console.log("لم يتم العثور على حاوية الويدجيت");
        return;
      }
      
      // طباعة محتوى الويدجيت للتشخيص
      console.log("محتوى الويدجيت:", widgetContainer.innerHTML);
      
      // محاولة استخراج السعر من العناصر المختلفة بترتيب الأولوية
      const priceSelectors = [
        '.tv-symbol-price-quote__value',
        '.tv-symbol-price-quote__last',
        '.tv-ticker-tape-price__value',
        'strong',
        'span[data-field="last"]',
        '.price-value',
        '[data-name="legend-value-item"]'
      ];
      
      // البحث عن السعر باستخدام جميع المحددات
      for (const selector of priceSelectors) {
        const elements = widgetContainer.querySelectorAll(selector);
        console.log(`البحث عن السعر باستخدام المحدد '${selector}'، تم العثور على ${elements.length} عنصر`);
        
        for (const element of elements) {
          const priceText = element.textContent;
          if (priceText) {
            console.log(`النص المستخرج من المحدد ${selector}: "${priceText}"`);
            // تنظيف النص لاستخراج الأرقام
            const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
            
            if (cleanText.match(/\d+([.,]\d+)?/)) {
              const normalizedText = cleanText.replace(/,/g, '.');
              const price = parseFloat(normalizedText);
              
              if (!isNaN(price) && price > 0) {
                if (price > 1000 && price < 5000) {
                  // محتمل أن يكون سعر الذهب
                  console.log(`تم استخراج سعر ذهب محتمل: ${price} من محدد ${selector}`);
                  if (price !== lastExtractedPrice.current) {
                    console.log(`تحديث السعر من ${lastExtractedPrice.current || 'غير معروف'} إلى ${price}`);
                    lastExtractedPrice.current = price;
                    
                    // إرسال حدث مخصص بالسعر المستخرج
                    window.dispatchEvent(
                      new CustomEvent('tradingview-price-update', {
                        detail: { price }
                      })
                    );
                    
                    // طلب التقاط صورة للتحقق من السعر باستخدام OCR
                    window.dispatchEvent(new Event('request-capture-widget'));
                    return;
                  }
                }
                // التعامل مع السعر المحتمل في صيغة أخرى (مثل 3.06 تعني 3060)
                else if (price > 1 && price < 10) {
                  const adjustedPrice = price * 1000;
                  console.log(`تعديل السعر المحتمل من ${price} إلى ${adjustedPrice}`);
                  if (adjustedPrice !== lastExtractedPrice.current) {
                    lastExtractedPrice.current = adjustedPrice;
                    window.dispatchEvent(
                      new CustomEvent('tradingview-price-update', {
                        detail: { price: adjustedPrice }
                      })
                    );
                    return;
                  }
                }
              }
            }
          }
        }
      }
      
      // فحص النص الكامل للويدجيت للبحث عن أنماط سعر الذهب
      const widgetText = widgetContainer.textContent || '';
      const goldPricePattern = /\b([23][\d]{3}\.[\d]{1,2})\b/;
      const match = widgetText.match(goldPricePattern);
      
      if (match && match[1]) {
        const price = parseFloat(match[1]);
        if (!isNaN(price) && price > 1000 && price < 5000) {
          console.log(`تم استخراج سعر من النص الكامل: ${price}`);
          if (price !== lastExtractedPrice.current) {
            lastExtractedPrice.current = price;
            window.dispatchEvent(
              new CustomEvent('tradingview-price-update', {
                detail: { price }
              })
            );
          }
        }
      }
    } catch (error) {
      console.error('خطأ أثناء استخراج السعر من الويدجيت:', error);
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
    
    // البدء بفحص ووجود السعر بفاصل زمني
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // استخراج السعر الأولي بعد تحميل الويدجيت
    setTimeout(() => {
      if (widgetLoadedRef.current) {
        console.log("محاولة استخراج السعر الأولي من الويدجيت");
        extractPriceFromWidget();
      }
    }, 2000);
    
    // إعداد فاصل زمني لتحديث السعر كل ثانية
    intervalRef.current = setInterval(() => {
      if (widgetLoadedRef.current) {
        extractPriceFromWidget();
      }
    }, 1000) as unknown as number;
  }, [extractPriceFromWidget]);

  return {
    setupPriceExtraction,
    extractPriceFromWidget,
    isWidgetLoaded: widgetLoadedRef.current
  };
};
