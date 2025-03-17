
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

    // جرب المحدد الرئيسي الذي قدمه المستخدم أولاً
    const tradingViewPriceElement = document.querySelector('.tv-symbol-price-quote__value.js-symbol-last');
    if (tradingViewPriceElement) {
      const priceText = tradingViewPriceElement.textContent?.trim();
      console.log('العنصر الموجود باستخدام المحدد الرئيسي:', priceText);
      
      if (priceText) {
        // تنظيف السعر من أي أحرف غير رقمية
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم استخراج سعر صحيح من المحدد الرئيسي: ${price}`);
          setLastExtractedPrice(price);
          return price;
        } else {
          console.log(`المحدد الرئيسي وجد قيمة، ولكنها ليست سعر ذهب صالح: ${price}`);
        }
      }
    } else {
      console.log('لم يتم العثور على العنصر باستخدام المحدد الرئيسي');
    }

    // البحث عن كل العناصر التي تحتوي على نص مناسب لسعر الذهب
    console.log('البحث عن أي عنصر مرئي يحتوي على سعر الذهب...');
    const allElements = document.querySelectorAll('div, span, p, strong');
    
    for (const element of allElements) {
      // التحقق من مرئية العنصر
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        continue;
      }

      const text = element.textContent?.trim();
      if (!text) continue;

      // البحث عن نص يشبه سعر الذهب (عادة في نطاق 1800-3500)
      if (/\b([1-3]\d{3}|\d{1,3}[,.]\d{1,2})\b/.test(text)) {
        // استخراج السعر من النص
        const matches = text.match(/\b([1-3]\d{3}|\d{1,3}[,.]\d{1,2})\b/g);
        if (matches) {
          for (const match of matches) {
            // تنظيف السعر وتحويله إلى رقم
            const cleanPrice = match.replace(',', '.');
            const price = parseFloat(cleanPrice);
            
            if (!isNaN(price) && price >= 1800 && price <= 3500) {
              console.log(`تم العثور على سعر ذهب محتمل: ${price} في العنصر:`, element);
              
              // التحقق من لون الخلفية للعنصر (قد يكون في شريط أخضر أو أحمر)
              const bgColor = style.backgroundColor;
              const parentBgColor = window.getComputedStyle(element.parentElement || element).backgroundColor;
              
              console.log(`لون خلفية العنصر: ${bgColor}, لون خلفية العنصر الأب: ${parentBgColor}`);
              
              // إذا كان العنصر أو والده له خلفية حمراء أو خضراء، فهذا مؤشر قوي
              const isColoredBackground = 
                /rgba?\((\d+),\s*(\d+),\s*(\d+)/i.test(bgColor) || 
                /rgba?\((\d+),\s*(\d+),\s*(\d+)/i.test(parentBgColor);
              
              if (isColoredBackground) {
                console.log(`تم العثور على سعر في عنصر ملون: ${price}`);
                setLastExtractedPrice(price);
                return price;
              }
              
              // حتى إذا لم نجد خلفية ملونة، نحتفظ بالسعر كمرشح
              setLastExtractedPrice(price);
              return price;
            }
          }
        }
      }
    }
    
    // محاولة البحث عن عنصر السعر باستخدام الطريقة القديمة
    const priceElement = getPriceElementOrFind();
    if (priceElement) {
      // استخراج السعر من النص
      const directText = priceElement.textContent?.trim();
      const price = extractPriceFromDirectText(directText);
      
      if (price !== null && price >= 1800 && price <= 3500) {
        console.log(`تم استخراج سعر بقيمة: ${price}`);
        setLastExtractedPrice(price);
        return price;
      }
    }
    
    console.log('لم يتم استخراج سعر صالح من الشارت');
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
