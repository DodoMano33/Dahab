
import { PRICE_ELEMENT_ATTRIBUTES } from './config';

/**
 * التحقق من صلاحية عنصر السعر
 */
export const isValidPriceElement = (element: HTMLElement): boolean => {
  if (!element) return false;
  
  const text = element.textContent?.trim();
  if (!text) return false;
  
  // التحقق من أن النص يتطابق مع نمط السعر
  const isMatchingPattern = PRICE_ELEMENT_ATTRIBUTES.regexPattern.test(text);
  if (!isMatchingPattern) {
    // محاولة التنظيف والتحقق مرة أخرى
    const cleanedText = text.replace(/[^\d.,]/g, '');
    if (!/^\d{1,5}([.,]\d{1,4})?$/.test(cleanedText)) {
      return false;
    }
  }
  
  // التحقق من حجم العنصر إذا كان مرئيًا
  const rect = element.getBoundingClientRect();
  if (rect.width < PRICE_ELEMENT_ATTRIBUTES.minWidth || rect.height < PRICE_ELEMENT_ATTRIBUTES.minHeight) {
    return false;
  }
  
  // فحص حجم الخط (إذا كان كبيرًا، فمن المحتمل أن يكون سعرًا رئيسيًا)
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseInt(computedStyle.fontSize, 10);
  if (fontSize < PRICE_ELEMENT_ATTRIBUTES.minFontSize) {
    return false;
  }
  
  // تحقق من عدم وجود أكثر من رقمين بعد العلامة العشرية
  const parts = text.replace(/[^\d.,]/g, '').split(/[.,]/);
  if (parts.length > 1 && parts[1].length > 4) {
    return false;
  }
  
  return true;
};

/**
 * التحقق من معقولية قيمة السعر للذهب
 */
export const isReasonableGoldPrice = (price: number): boolean => {
  // سعر الذهب عادة بين 500 و 5000 دولار للأونصة
  return price > 500 && price < 5000;
};
