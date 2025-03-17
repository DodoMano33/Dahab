
/**
 * وحدة استخراج السعر من الشارت فقط
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

    // البحث عن أرقام محددة في أعلى الشارت (تطابق ما يظهر في الصورة)
    const chartHeaderNumbers = document.querySelectorAll('[class*="price"], [class*="quote"], [class*="value"]');
    for (const element of chartHeaderNumbers) {
      const text = element.textContent?.trim();
      if (text && /^\s*\d{1,4}(,\d{3})*\.\d{1,3}\s*$/.test(text)) {
        const price = parseFloat(text.replace(/,/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر من عنوان الشارت: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
      }
    }
    
    // البحث بشكل مباشر عن الأرقام في نطاق سعر الذهب في كامل الشارت
    const allElements = document.querySelectorAll('*');
    for (const element of allElements) {
      const text = element.textContent?.trim();
      if (text && /\b(2|3)\d{3}\.\d{1,3}\b/.test(text)) {
        console.log('محتمل أن يكون سعر ذهب:', text);
        // استخراج الرقم من النص
        const matches = text.match(/\b(2|3)\d{3}\.\d{1,3}\b/);
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
      
      // البحث عن أي عنصر مرئي على حافة الشارت قد يكون يعرض السعر
      console.log(`البحث في جميع العناصر المرئية على حافة الشارت...`);
      
      // البحث خصيصاً عن الأرقام التي تظهر في شريط على الشارت (كما في الصورة)
      const chartPriceElements = document.querySelectorAll('.chart-toolbar .chart-container .chart-price, .chart-title-indicator, .pane-legend-line .pane-legend-line__value, .pane-legend-line__value');
      for (const element of chartPriceElements) {
        const text = element.textContent?.trim();
        if (text && /\b(2|3)\d{3}(\.\d{1,3})?\b/.test(text)) {
          console.log('تم العثور على عنصر سعر في الشارت:', text);
          const price = parseFloat(text.replace(/[^\d.]/g, ''));
          if (!isNaN(price) && price >= 1800 && price <= 3500) {
            console.log(`تم استخراج سعر صحيح من الشارت: ${price}`);
            setLastExtractedPrice(price);
            return price;
          }
        }
      }
      
      // محاولة البحث عن السعر مباشرة في العنوان
      const titleElement = document.querySelector('.chart-title-price');
      if (titleElement && titleElement.textContent) {
        const priceMatch = titleElement.textContent.match(/\b(2|3)\d{3}(\.\d{1,2})?\b/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[0]);
          console.log(`تم استخراج السعر من عنوان الشارت: ${price}`);
          setLastExtractedPrice(price);
          return price;
        }
      }
      
      // لم يتم العثور على سعر
      console.log('لم يتم العثور على سعر صالح من الشارت');
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
 * الدالة الرئيسية لاستخراج السعر
 */
export const extractAndBroadcastPrice = async () => {
  try {
    console.log('بدء عملية استخراج السعر...');
    const price = await extractPriceFromChart();
    if (price !== null) {
      console.log(`تم استخراج السعر: ${price}`);
      
      // إرسال حدث مخصص مع السعر
      window.dispatchEvent(new CustomEvent('tradingview-price-update', {
        detail: { price, timestamp: Date.now() }
      }));
      
      // تحديث عنصر عرض السعر مباشرة إن وجد
      const priceDisplayElements = document.querySelectorAll('[id="stats-price-display"]');
      priceDisplayElements.forEach(element => {
        element.textContent = price.toFixed(2);
      });
      
      return price;
    } else {
      console.log('لم يتم استخراج سعر صالح');
      return null;
    }
  } catch (error) {
    console.error('فشل في استخراج السعر:', error);
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
