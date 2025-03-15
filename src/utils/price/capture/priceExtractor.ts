
/**
 * وحدة استخراج السعر الرئيسية
 */

import { getPriceElementOrFind } from './elementFinder';
import { isCapturingActive, getLastExtractedPrice } from './state';
import { extractPriceFromDirectText } from './directTextExtractor';
import { extractPriceUsingOCR } from './ocrExtractor';
import { broadcastPrice } from './priceBroadcaster';

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
      const lastPrice = getLastExtractedPrice();
      
      // نشر السعر فقط إذا تغير بشكل ملحوظ أو كان هذا أول سعر
      // استخدام نسبة مئوية للتغيير بدلاً من قيمة ثابتة (0.01٪ من السعر)
      const minChangeThreshold = price * 0.0001;
      
      if (lastPrice === null || Math.abs(price - lastPrice) > minChangeThreshold) {
        console.log('تم اكتشاف تغيير في السعر، جاري البث...');
        broadcastPrice(price);
      } else {
        console.log('لم يتغير السعر بشكل كافٍ للبث:', price, 'آخر سعر:', lastPrice);
      }
    } else {
      console.log('لم يتم استخراج سعر صالح');
    }
  } catch (error) {
    console.error('فشل في استخراج السعر:', error);
  }
};

// تصدير الوظائف الرئيسية للاستخدام من قبل ملفات أخرى
export { broadcastPrice } from './priceBroadcaster';
