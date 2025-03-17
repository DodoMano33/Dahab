
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

    // جرب المحدد الجديد الذي قدمه المستخدم أولاً
    const tradingViewPriceElement = document.querySelector('.tv-symbol-price-quote__value.js-symbol-last');
    if (tradingViewPriceElement) {
      const priceText = tradingViewPriceElement.textContent?.trim();
      console.log('تم العثور على سعر TradingView باستخدام المحدد المخصص:', priceText);
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر صحيح من TradingView: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }
    
    // البحث عن أي عنصر مرئي على الشارت قد يكون يعرض السعر
    const allElements = document.querySelectorAll('*');
    for (const element of allElements) {
      const text = element.textContent?.trim();
      if (text && /\b(2|3)\d{3}\.\d{1,2}\b/.test(text)) {
        console.log('محتمل أن يكون سعر ذهب:', text);
        // استخراج الرقم من النص
        const matches = text.match(/\b(2|3)\d{3}\.\d{1,2}\b/);
        if (matches) {
          const price = parseFloat(matches[0]);
          if (price >= 1800 && price <= 3500) {
            console.log(`تم استخراج سعر ذهب محتمل: ${price}`);
            setLastExtractedPrice(price);
            return price;
          }
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
