
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

    // البحث عن عنصر السعر الرئيسي كما يظهر في الصورة
    const mainPriceElement = document.querySelector('.js-symbol-last, .tv-symbol-price-quote__value');
    if (mainPriceElement) {
      const priceText = mainPriceElement.textContent?.trim();
      console.log('تم العثور على سعر TradingView في العنصر الرئيسي:', priceText);
      if (priceText) {
        // تنظيف النص واستخراج الرقم
        const price = parseFloat(priceText.replace(/,/g, '').replace(/[^\d.]/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر صحيح من العنصر الرئيسي: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }

    // البحث عن عنصر السعر الكبير في واجهة TradingView (مثل الذي يظهر في الصورة)
    const largePriceElements = document.querySelectorAll('[data-name="legend-series-item"] .price-value, .chart-toolbar-price-value, .price-line-price-label, .chart-status-price');
    for (const element of largePriceElements) {
      const priceText = element.textContent?.trim();
      console.log('تم العثور على عنصر سعر محتمل:', priceText);
      if (priceText) {
        // تنظيف النص واستخراج الرقم
        const price = parseFloat(priceText.replace(/,/g, '').replace(/[^\d.]/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر صحيح من عنصر السعر: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }
    
    // البحث عن أي عنصر رقمي كبير في الصفحة قد يكون سعر الذهب
    const allElements = document.querySelectorAll('*');
    for (const element of allElements) {
      const text = element.textContent?.trim();
      if (text && /\b[1-3][\d,]{3,6}\.\d{1,3}\b/.test(text)) {
        console.log('محتمل أن يكون سعر ذهب:', text);
        // استخراج الرقم من النص
        const price = parseFloat(text.replace(/,/g, '').replace(/[^\d.]/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر ذهب محتمل: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }
    
    // جرب تقنية أخرى للبحث عن نمط رقمي يشبه سعر الذهب
    const bodyText = document.body.textContent || '';
    const goldPriceMatches = bodyText.match(/\b[1-3][\d,]{3,6}\.\d{1,3}\b/g);
    if (goldPriceMatches) {
      for (const match of goldPriceMatches) {
        const price = parseFloat(match.replace(/,/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر ذهب من نص الصفحة: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }
    
    // البحث عن عنصر السعر باستخدام الطريقة القديمة
    const priceElement = getPriceElementOrFind();
    if (!priceElement) {
      console.warn('لم يتم العثور على عنصر السعر في الشارت');
      return null;
    }
    
    // استخراج السعر من النص
    const directText = priceElement.textContent?.trim();
    const price = extractPriceFromDirectText(directText);
    
    if (price !== null && price >= 1800 && price <= 3500) {
      console.log(`تم استخراج سعر بقيمة: ${price}`);
      setLastExtractedPrice(price);
      return price;
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
