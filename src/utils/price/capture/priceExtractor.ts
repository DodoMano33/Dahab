
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
    
    // البحث عن نص CFI في أو حول العنصر للتأكد من أنه سعر CFI
    const isCFIPrice = checkIfCFIPrice(priceElement);
    
    // محاولة قراءة النص مباشرة من العنصر
    const directText = priceElement.textContent?.trim();
    const price = extractPriceFromDirectText(directText);
    
    if (price !== null) {
      console.log(`تم استخراج سعر ${isCFIPrice ? 'CFI' : ''} بقيمة: ${price}`);
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
 * التحقق مما إذا كان عنصر السعر ينتمي إلى CFI
 */
const checkIfCFIPrice = (element: Element): boolean => {
  try {
    // البحث في العنصر وأي عناصر محيطة عن نص CFI أو تحديد آخر
    const elementText = element.textContent || '';
    if (elementText.includes('CFI')) return true;
    
    // البحث في العناصر القريبة
    const parentElement = element.parentElement;
    if (parentElement) {
      if (parentElement.textContent?.includes('CFI')) return true;
      
      // التحقق من العناصر المجاورة
      const siblings = Array.from(parentElement.children);
      for (const sibling of siblings) {
        if (sibling.textContent?.includes('CFI')) return true;
      }
    }
    
    // البحث في منطقة أوسع حول العنصر
    const container = document.querySelector('.tv-chart-view__area') || document.body;
    const cfiElements = container.querySelectorAll('*');
    for (const el of Array.from(cfiElements).slice(0, 20)) { // تحقق من أول 20 عنصر فقط لتحسين الأداء
      if (el.textContent?.includes('CFI')) return true;
    }
    
    return false;
  } catch (e) {
    console.warn('خطأ أثناء التحقق من مصدر السعر:', e);
    return false;
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
      // تحديد مصدر السعر إلى CFI في البث
      broadcastPrice(price, false, 'CFI:XAUUSD');
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
  if (requestPriceUpdate('CFI:XAUUSD')) {
    return true;
  }
  
  // إذا لم يكن هناك سعر مخزن، حاول استخراج سعر جديد
  console.log('محاولة استخراج سعر جديد للتحديث الفوري...');
  const price = await extractPriceFromChart();
  
  if (price !== null) {
    broadcastPrice(price, true, 'CFI:XAUUSD');
    return true;
  }
  
  return false;
};

// تصدير الوظائف الرئيسية للاستخدام من قبل ملفات أخرى
export { broadcastPrice, requestPriceUpdate } from './priceBroadcaster';

