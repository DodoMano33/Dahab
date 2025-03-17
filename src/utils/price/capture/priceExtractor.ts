
/**
 * وحدة استخراج السعر من الشارت
 */

import { getPriceElementOrFind } from './elementFinder';
import { setLastExtractedPrice } from './state';
import { extractPriceFromDirectText } from './directTextExtractor';

/**
 * استخراج السعر من عنصر الشارت
 */
export const extractPriceFromChart = async (): Promise<number | null> => {
  try {
    console.log('بدء محاولة استخراج السعر من الشارت...');

    // البحث المباشر عن عنصر TradingView الذي يحتوي على السعر
    const priceSelectors = [
      '.tv-symbol-price-quote__value',        // محدد السعر الرئيسي
      '[data-name="legend-series-item"] .tv-symbol-price-quote__value',
      '.js-symbol-last',                      // محدد آخر سعر
      '.tv-symbol-price-quote__value--large', // محدد للنسخة الكبيرة من السعر
      '.chart-toolbar-price-value',           // محدد لشريط الأدوات
      '.chart-status-price',                  // محدد لحالة الشارت
      '.tv-symbol-header__first-line'         // محدد آخر للسعر في الترويسة
    ];

    // تجربة كل محدد على حدة
    for (const selector of priceSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const priceText = element.textContent?.trim();
        if (priceText) {
          // التحقق من وجود نمط مثل 2,999.350 أو 2999.35
          if (/\d+,\d+\.\d+|\d+\.\d+/.test(priceText)) {
            // استخراج الرقم بشكل صحيح من النص (مثل 2,999.350)
            const price = parseFloat(priceText.replace(/,/g, ''));
            if (!isNaN(price) && price > 0) {
              console.log(`تم استخراج سعر من المحدد "${selector}": ${price}`);
              setLastExtractedPrice(price);
              
              // بث السعر المستخرج للتطبيق
              window.dispatchEvent(new CustomEvent('tradingview-price-update', {
                detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
              }));
              
              // أيضًا نرسل حدث price-updated لضمان استلامه
              window.dispatchEvent(new CustomEvent('price-updated', {
                detail: { price, source: 'price-extractor' }
              }));
              
              return price;
            }
          }
        }
      }
    }

    // فحص في iframe إن وجد
    try {
      const iframes = document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDocument) {
            for (const selector of priceSelectors) {
              const elements = iframeDocument.querySelectorAll(selector);
              for (const element of elements) {
                const priceText = element.textContent?.trim();
                if (priceText && /\d+,\d+\.\d+|\d+\.\d+/.test(priceText)) {
                  const price = parseFloat(priceText.replace(/,/g, ''));
                  if (!isNaN(price) && price > 0) {
                    console.log(`تم استخراج سعر من iframe "${selector}": ${price}`);
                    setLastExtractedPrice(price);
                    
                    window.dispatchEvent(new CustomEvent('tradingview-price-update', {
                      detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
                    }));
                    
                    return price;
                  }
                }
              }
            }
          }
        } catch (e) {
          // تجاهل أخطاء الوصول لمحتوى الإطارات بسبب سياسة same-origin
        }
      }
    } catch (e) {
      console.error('خطأ عند محاولة فحص الإطارات:', e);
    }
    
    // فحص أكثر شمولاً في الصفحة
    const allPriceElements = document.querySelectorAll('div, span, strong, b');
    for (const element of allPriceElements) {
      const text = element.textContent?.trim();
      // البحث عن نمط نصي يمثل سعر ذهب (مثل 2,999.350 أو 2999.35)
      if (text && /\b\d+,\d+\.\d+\b|\b\d+\.\d+\b/.test(text)) {
        const matches = text.match(/\b\d+,\d+\.\d+\b|\b\d+\.\d+\b/);
        if (matches && matches[0]) {
          const price = parseFloat(matches[0].replace(/,/g, ''));
          if (!isNaN(price) && price > 0) {
            console.log(`تم استخراج سعر من نص عام: ${price} (${text})`);
            setLastExtractedPrice(price);
            
            // بث السعر المستخرج للتطبيق
            window.dispatchEvent(new CustomEvent('tradingview-price-update', {
              detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
            }));
            
            return price;
          }
        }
      }
    }
    
    // إذا لم ننجح بالطرق المباشرة، نستخدم طريقة استخراج السعر من العنصر
    const priceElement = getPriceElementOrFind();
    if (priceElement) {
      const directText = priceElement.textContent?.trim();
      const price = extractPriceFromDirectText(directText);
      
      if (price !== null && price > 0) {
        console.log(`تم استخراج سعر بقيمة: ${price}`);
        setLastExtractedPrice(price);
        
        // بث السعر المستخرج للتطبيق
        window.dispatchEvent(new CustomEvent('tradingview-price-update', {
          detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
        }));
        
        return price;
      }
    }
    
    console.log('لم يتم استخراج سعر');
    return null;
  } catch (error) {
    console.error('فشل في استخراج السعر من الشارت:', error);
    return null;
  }
};

/**
 * طلب تحديث فوري للسعر الحالي
 */
export const requestImmediatePriceUpdate = async (): Promise<boolean> => {
  // محاولة الحصول على السعر من العناصر المرئية أولاً
  const priceSelectors = [
    '.tv-symbol-price-quote__value',
    '.js-symbol-last',
    '.tv-symbol-header__first-line',
    '.chart-toolbar-price-value'
  ];
  
  for (const selector of priceSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent?.trim();
      if (text && /\d+,\d+\.\d+|\d+\.\d+/.test(text)) {
        const price = parseFloat(text.replace(/,/g, ''));
        if (!isNaN(price) && price > 0) {
          console.log(`تم استخراج سعر مباشر للتحديث الفوري: ${price} (من ${selector})`);
          
          // تحديث آخر سعر تم استخراجه
          setLastExtractedPrice(price);
          
          // بث تحديث السعر
          window.dispatchEvent(new CustomEvent('tradingview-price-update', {
            detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
          }));
          
          // إرسال الحدث البديل أيضًا لضمان التوافق
          window.dispatchEvent(new CustomEvent('price-updated', {
            detail: { price, source: 'immediate-extractor' }
          }));
          
          return true;
        }
      }
    }
  }
  
  // محاولة استخراج سعر جديد إذا لم نجد في العناصر المرئية
  console.log('محاولة استخراج سعر جديد للتحديث الفوري...');
  const price = await extractPriceFromChart();
  
  if (price !== null) {
    // إرسال حدث مخصص مع السعر
    window.dispatchEvent(new CustomEvent('tradingview-price-update', {
      detail: { price, timestamp: Date.now() }
    }));
    return true;
  }
  
  return false;
};
