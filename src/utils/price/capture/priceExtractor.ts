
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
    // البحث عن عنصر السعر
    const priceElement = getPriceElementOrFind();
    if (!priceElement) {
      console.warn('لم يتم العثور على عنصر السعر في الشارت');
      return null;
    }
    
    // محاولة قراءة النص مباشرة من العنصر
    const directText = priceElement.textContent?.trim();
    const price = extractPriceFromDirectText(directText);
    
    if (price !== null) {
      console.log(`تم استخراج سعر بقيمة: ${price}`);
      
      // حفظ السعر المستخرج
      setLastExtractedPrice(price);
      
      // إبلاغ السعر مباشرة إلى أي عنصر مرئي للعرض
      const priceDisplayElement = document.getElementById('tradingview-price-display');
      if (priceDisplayElement) {
        priceDisplayElement.textContent = `السعر الحالي: ${price.toFixed(2)}`;
      }
      
      return price;
    }
    
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
      
      // تحديث أي عناصر واجهة مستخدم
      updateUIElements(price);
    } else {
      console.log('لم يتم استخراج سعر صالح');
    }
  } catch (error) {
    console.error('فشل في استخراج السعر:', error);
  }
};

/**
 * تحديث عناصر واجهة المستخدم بالسعر الجديد
 */
const updateUIElements = (price: number) => {
  // تحديث أي عناصر عرض للسعر في واجهة المستخدم
  const priceElements = document.querySelectorAll('[data-price-display]');
  priceElements.forEach(element => {
    element.textContent = price.toString();
  });
};

/**
 * طلب تحديث فوري للسعر الحالي
 */
export const requestImmediatePriceUpdate = async (): Promise<boolean> => {
  // محاولة استخراج سعر جديد
  console.log('محاولة استخراج سعر جديد للتحديث الفوري...');
  const price = await extractPriceFromChart();
  
  if (price !== null) {
    updateUIElements(price);
    return true;
  }
  
  return false;
};
