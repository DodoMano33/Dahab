
import { PRICE_SELECTOR, ALTERNATIVE_SELECTORS } from './config';
import { getPriceElement, setPriceElement } from './state';
import { isValidPriceElement } from './validators';
import { findElementsWithPriceText, findBestPriceElement, searchInIframes } from './priceFinder';
import { captureElement } from './elementCapture';

/**
 * البحث عن عنصر السعر في الشارت
 */
export const findPriceElement = (): HTMLElement | null => {
  console.log('البحث عن عنصر السعر باستخدام المحدد الرئيسي:', PRICE_SELECTOR);
  
  // 1. محاولة العثور على المحدد الرئيسي
  let element = document.querySelector(PRICE_SELECTOR) as HTMLElement | null;
  if (element && isValidPriceElement(element)) {
    console.log('تم العثور على عنصر السعر باستخدام المحدد الرئيسي');
    return element;
  }
  
  // 2. البحث في جميع الإطارات المضمنة
  element = searchInIframes();
  if (element) {
    return element;
  }
  
  // 3. تجربة المحددات البديلة في المستند الرئيسي
  console.log('جاري تجربة المحددات البديلة...');
  for (const selector of ALTERNATIVE_SELECTORS) {
    try {
      element = document.querySelector(selector) as HTMLElement | null;
      if (element && isValidPriceElement(element)) {
        console.log('تم العثور على عنصر السعر باستخدام المحدد البديل:', selector);
        return element;
      }
    } catch (e) {
      // تجاهل أي أخطاء
    }
  }
  
  // 4. البحث عن أي عنصر يحتوي على نص يشبه السعر
  console.log('البحث عن عناصر تحتوي على نص يشبه السعر...');
  const priceElements = findElementsWithPriceText();
  if (priceElements.length > 0) {
    // اختيار العنصر الأكبر حجمًا من العناصر المحتملة
    const bestElement = findBestPriceElement(priceElements);
    if (bestElement) {
      console.log('تم العثور على أفضل عنصر سعر محتمل:', bestElement.textContent?.trim());
      return bestElement;
    }
  }
  
  console.warn('لم يتم العثور على عنصر السعر باستخدام أي من الطرق');
  return null;
};

/**
 * الحصول على عنصر السعر أو البحث عنه إذا لم يكن موجودًا
 */
export const getPriceElementOrFind = (): HTMLElement | null => {
  let element = getPriceElement();
  
  // إذا لم يكن العنصر موجودًا، ابحث عنه
  if (!element) {
    console.log('لا يوجد عنصر سعر مخزن، جاري البحث...');
    element = findPriceElement();
    if (element) {
      console.log('تم العثور على عنصر السعر وتخزينه، القيمة:', element.textContent?.trim());
      setPriceElement(element);
    }
  } else {
    // التحقق من صحة العنصر المخزن
    if (!document.body.contains(element) || !isValidPriceElement(element)) {
      console.log('عنصر السعر المخزن غير صالح، جاري البحث عن عنصر جديد...');
      element = findPriceElement();
      if (element) {
        console.log('تم العثور على عنصر السعر الجديد وتخزينه، القيمة:', element.textContent?.trim());
        setPriceElement(element);
      } else {
        setPriceElement(null);
      }
    }
  }
  
  return element;
};

// إعادة تصدير الدالة captureElement من الملف الخاص بها
export { captureElement };
