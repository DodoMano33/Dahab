
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
      
      // محاولة استخراج السعر من العناصر المختلفة بترتيب الأولوية
      const priceSelectors = [
        '.tv-symbol-price-quote__value',
        '.tv-symbol-price-quote__last',
        '.tv-ticker-tape-price__value',
        'strong',
        'span[data-field="last"]',
        '.price-value',
        '[data-name="legend-value-item"]',
        // محاولة اختيار عناصر إضافية قد تحتوي على السعر
        '.tv-symbol-header__first-line',
        '.tv-fundamental-block__value',
        '.tv-ticker-item-last__value',
        '.js-symbol-last',
        // محاولة استهداف عناصر عامة
        'div div strong',
        '.text-xl',
        '.font-bold'
      ];
      
      // البحث عن السعر باستخدام جميع المحددات
      for (const selector of priceSelectors) {
        const elements = widgetContainer.querySelectorAll(selector);
        console.log(`البحث عن السعر باستخدام المحدد '${selector}'، تم العثور على ${elements.length} عنصر`);
        
        for (const element of elements) {
          const priceText = element.textContent;
          if (priceText) {
            console.log(`النص المستخرج من المحدد ${selector}: "${priceText}"`);
            
            // محاولة العثور على نمط السعر مباشرة (مثل "3,065.48" أو "3065.48")
            const pricePattern = /([123][,\d]{0,3}\.?\d{0,2})/;
            const priceMatch = priceText.match(pricePattern);
            
            if (priceMatch && priceMatch[1]) {
              const cleanPrice = priceMatch[1].replace(/,/g, '');
              const price = parseFloat(cleanPrice);
              
              if (!isNaN(price) && price > 1000 && price < 5000) {
                console.log(`تم استخراج سعر ذهب: ${price} من محدد ${selector}`);
                if (price !== lastExtractedPrice.current) {
                  console.log(`تحديث السعر من ${lastExtractedPrice.current || 'غير معروف'} إلى ${price}`);
                  lastExtractedPrice.current = price;
                  
                  // إرسال حدث مخصص بالسعر المستخرج
                  window.dispatchEvent(
                    new CustomEvent('tradingview-price-update', {
                      detail: { price, source: 'widget-extraction' }
                    })
                  );
                  
                  return;
                }
              }
            }
            
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
                        detail: { price, source: 'widget-extraction' }
                      })
                    );
                    
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
                        detail: { price: adjustedPrice, source: 'widget-extraction-adjusted' }
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
      console.log("النص الكامل للويدجيت:", widgetText);
      
      // محاولة استخراج مباشرة باستخدام أنماط خاصة للذهب
      const goldPatterns = [
        /\b([123][\d]{3}\.[\d]{1,2})\b/, // 3065.48
        /\b([123]),(\d{3})\.(\d{1,2})\b/, // 3,065.48
        /XAUUSD[^0-9]*([123][\d]{3}\.[\d]{1,2})/ // XAUUSD: 3065.48
      ];
      
      for (const pattern of goldPatterns) {
        const match = widgetText.match(pattern);
        if (match) {
          let price;
          if (match.length >= 4) {
            // نمط مثل 3,065.48
            price = parseFloat(`${match[1]}${match[2]}.${match[3]}`);
          } else if (match[1]) {
            // نمط بسيط مثل 3065.48
            price = parseFloat(match[1]);
          }
          
          if (price && !isNaN(price) && price > 1000 && price < 5000) {
            console.log(`تم استخراج سعر من النص الكامل: ${price}`);
            if (price !== lastExtractedPrice.current) {
              lastExtractedPrice.current = price;
              window.dispatchEvent(
                new CustomEvent('tradingview-price-update', {
                  detail: { price, source: 'widget-fulltext' }
                })
              );
              return;
            }
          }
        }
      }
      
      // آخر محاولة: البحث عن أي رقم في النطاق المناسب
      const anyNumberPattern = /\b(\d{1,4}\.?\d{0,2})\b/g;
      const numberMatches = widgetText.match(anyNumberPattern);
      
      if (numberMatches) {
        for (const numStr of numberMatches) {
          const num = parseFloat(numStr);
          if (!isNaN(num) && num > 1000 && num < 5000) {
            console.log(`تم العثور على رقم محتمل في النص الكامل: ${num}`);
            if (num !== lastExtractedPrice.current) {
              lastExtractedPrice.current = num;
              window.dispatchEvent(
                new CustomEvent('tradingview-price-update', {
                  detail: { price: num, source: 'widget-number-extraction' }
                })
              );
              return;
            }
          }
        }
      }
      
      // محاولة يدوية لاستخراج السعر
      if (extractionAttemptsRef.current % 5 === 0) { // كل 5 محاولات
        console.log("محاولة يدوية لالتقاط صورة والتعرف على السعر");
        window.dispatchEvent(new Event('request-capture-widget'));
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
    
    // استخراج فوري للسعر
    extractPriceFromWidget();
    
    // البدء بفحص وجود السعر بفاصل زمني
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // استخراج السعر بشكل دوري
    intervalRef.current = setInterval(() => {
      if (widgetLoadedRef.current) {
        extractPriceFromWidget();
      }
    }, 1000) as unknown as number;
    
    // محاولة استخراج السعر بعد التأخيرات المختلفة للتأكد من تحميل الويدجيت بالكامل
    setTimeout(() => extractPriceFromWidget(), 1000);
    setTimeout(() => extractPriceFromWidget(), 3000);
    setTimeout(() => extractPriceFromWidget(), 5000);
    setTimeout(() => extractPriceFromWidget(), 10000);
  }, [extractPriceFromWidget]);

  return {
    setupPriceExtraction,
    extractPriceFromWidget,
    isWidgetLoaded: widgetLoadedRef.current
  };
};
