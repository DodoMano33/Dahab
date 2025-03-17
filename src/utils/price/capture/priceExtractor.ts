
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
      '.tv-symbol-price-quote__value--large', // محدد للنسخة الكبيرة من السعر
      '.chart-toolbar-price-value',           // محدد لشريط الأدوات
      '.chart-status-price'                   // محدد لحالة الشارت
    ];

    // تجربة كل محدد على حدة
    for (const selector of priceSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const priceText = element.textContent?.trim();
        if (priceText) {
          // استخراج الرقم بشكل صحيح من النص (مثل 2,999.350)
          const price = parseFloat(priceText.replace(/,/g, ''));
          if (!isNaN(price) && price >= 1800 && price <= 3500) {
            console.log(`تم استخراج سعر من المحدد "${selector}": ${price}`);
            setLastExtractedPrice(price);
            return price;
          }
        }
      }
    }

    // فحص أكثر شمولاً في الصفحة
    const allPriceElements = document.querySelectorAll('div, span, strong, b');
    for (const element of allPriceElements) {
      const text = element.textContent?.trim();
      // البحث عن نمط نصي يمثل سعر ذهب (مثل 2,999.350)
      if (text && /\b[1-3](,\d{3})*\.\d{1,3}\b/.test(text)) {
        const price = parseFloat(text.replace(/,/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر من نص عام: ${price} (${text})`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }
    
    // الطريقة الاحتياطية - البحث في عناصر الصفحة عن أي رقم يشبه سعر الذهب
    const bodyText = document.body.textContent || '';
    const goldPriceMatches = bodyText.match(/\b[1-3](,\d{3})*\.\d{1,3}\b/g);
    if (goldPriceMatches) {
      for (const match of goldPriceMatches) {
        const price = parseFloat(match.replace(/,/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر من نص الصفحة: ${price} (${match})`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }
    
    // إذا لم ننجح بالطرق المباشرة، نستخدم طريقة العنصر
    const priceElement = getPriceElementOrFind();
    if (priceElement) {
      const directText = priceElement.textContent?.trim();
      const price = extractPriceFromDirectText(directText);
      
      if (price !== null && price >= 1800 && price <= 3500) {
        console.log(`تم استخراج سعر بقيمة: ${price}`);
        setLastExtractedPrice(price);
        return price;
      }
    }
    
    // كرجعة أخيرة، نبحث عن أرقام تبدأ بـ 2 أو 3 وتحتوي على نقطة عشرية
    const digitMatches = document.body.textContent?.match(/\b[23]\d*\.\d+\b/g);
    if (digitMatches) {
      for (const match of digitMatches) {
        const price = parseFloat(match);
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر محتمل من نص عام: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
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
  // محاولة استخراج سعر جديد
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
