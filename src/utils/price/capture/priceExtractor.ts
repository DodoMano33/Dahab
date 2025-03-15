
/**
 * وحدة استخراج السعر الرئيسية
 */

import { getPriceElementOrFind } from './elementFinder';
import { isCapturingActive, getLastExtractedPrice } from './state';
import { extractPriceFromDirectText } from './directTextExtractor';
import { extractPriceUsingOCR } from './ocrExtractor';
import { broadcastPrice, requestPriceUpdate } from './priceBroadcaster';

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
      return price;
    }
    
    // استخدام OCR كخطة احتياطية
    return await extractPriceUsingOCR(priceElement);
  } catch (error) {
    console.error('فشل في استخراج السعر من الشارت:', error);
    return null;
  }
};

/**
 * الدالة الرئيسية لاستخراج السعر وبثه
 */
export const extractAndBroadcastPrice = async () => {
  try {
    if (!isCapturingActive()) {
      console.log('عملية التقاط السعر غير نشطة حالياً');
      return;
    }
    
    console.log('بدء عملية استخراج السعر...');
    const price = await extractPriceFromChart();
    if (price !== null) {
      broadcastPrice(price);
    } else {
      console.log('لم يتم استخراج سعر صالح');
    }
  } catch (error) {
    console.error('فشل في استخراج السعر:', error);
  }
};

/**
 * طلب تحديث فوري للسعر الحالي
 */
export const requestImmediatePriceUpdate = async (): Promise<boolean> => {
  // محاولة بث السعر المخزن أولاً
  if (requestPriceUpdate()) {
    return true;
  }
  
  // إذا لم يكن هناك سعر مخزن، حاول استخراج سعر جديد
  console.log('محاولة استخراج سعر جديد للتحديث الفوري...');
  const price = await extractPriceFromChart();
  
  if (price !== null) {
    broadcastPrice(price, true);
    return true;
  }
  
  return false;
};

// تصدير الوظائف الرئيسية للاستخدام من قبل ملفات أخرى
export { broadcastPrice, requestPriceUpdate } from './priceBroadcaster';
