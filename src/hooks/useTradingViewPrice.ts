
import { useRef, useEffect } from 'react';

/**
 * هوك مخصص للتعامل مع استخراج السعر من ويدجيت TradingView
 */
export const useTradingViewPrice = (containerRef: React.RefObject<HTMLDivElement>) => {
  const intervalRef = useRef<number | null>(null);
  const lastExtractedPrice = useRef<number | null>(null);
  const widgetLoadedRef = useRef<boolean>(false);

  // دالة محسنة لاستخراج السعر من الويدجيت البسيط
  const extractPriceFromWidget = () => {
    if (!containerRef.current) return;
    
    try {
      // الويدجيت البسيط - يظهر السعر في عنصر strong
      const priceSelectors = [
        'strong', // الويدجيت البسيط يضع السعر في عنصر strong
        '.tv-ticker-tape-price__value', // احتياطي
        '.tv-symbol-price-quote__value', // احتياطي
        '[data-field="last"]', // احتياطي
        '.price-value'  // احتياطي
      ];
      
      // البحث عن عنصر السعر باستخدام المحددات
      for (const selector of priceSelectors) {
        const elements = containerRef.current.querySelectorAll(selector);
        console.log(`البحث باستخدام المحدد '${selector}'، تم العثور على ${elements.length} عنصر`);
        
        if (elements && elements.length > 0) {
          for (const element of elements) {
            const priceText = element.textContent;
            if (priceText) {
              console.log(`TradingViewWidget: النص المستخرج من '${selector}': "${priceText}"`);
              
              // تنظيف النص واستخراج الرقم - نتوقع صيغة مثل "3,030.519"
              // نزيل الفواصل ونحول النقاط إلى فواصل عشرية
              const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
              
              if (cleanText.match(/\d+([.,]\d+)?/)) {
                const normalizedText = cleanText.replace(/,/g, '.');
                const price = parseFloat(normalizedText);
                
                if (!isNaN(price) && price > 0) {
                  // التحقق من نطاق سعر الذهب - حاليًا بين 1500-5000
                  if (price > 1500 && price < 5000) {
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
      
      // طريقة 1: البحث عن نمط السعر مثل "3,065.48"
      const pricePattern = /\b[1-5],\d{3}\.\d{1,3}\b/g; // نمط مثل "3,065.48"
      const matches = allText.match(pricePattern);
      
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const price = parseFloat(match.replace(/,/g, ''));
          if (!isNaN(price) && price > 1500 && price < 5000) {
            console.log(`تم استخراج سعر من نص الصفحة (نمط ${price > 3000 ? '3000+' : '1000-3000'}): ${price}`);
            
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
      
      // طريقة 2: البحث عن أي رقم في نطاق أسعار الذهب
      const potentialPriceMatches = allText.match(/\b\d{4}\.\d{2}\b/g); // مثل "3065.48"
      if (potentialPriceMatches && potentialPriceMatches.length > 0) {
        for (const match of potentialPriceMatches) {
          const price = parseFloat(match);
          if (!isNaN(price) && price > 1500 && price < 5000) {
            console.log(`تم استخراج سعر من نص الصفحة (نمط بدون فواصل): ${price}`);
            
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
    } catch (error) {
      console.error("خطأ أثناء استخراج السعر:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const setupPriceExtraction = () => {
    widgetLoadedRef.current = true;
    console.log("إعداد استخراج السعر من الويدجيت");
    
    // تأخير أطول للتأكد من تحميل الويدجيت بالكامل
    setTimeout(() => {
      extractPriceFromWidget();
      
      // طلب التقاط صورة للويدجيت بعد تحميله
      window.dispatchEvent(new Event('request-capture-widget'));
    }, 1000);
    
    // إعداد فاصل زمني لتحديث السعر
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (widgetLoadedRef.current) {
        extractPriceFromWidget();
      }
    }, 2000) as unknown as number;
  };

  return {
    setupPriceExtraction,
    extractPriceFromWidget,
    isWidgetLoaded: widgetLoadedRef.current
  };
};
