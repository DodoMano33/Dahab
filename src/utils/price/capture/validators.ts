
/**
 * وحدة التحقق من صحة السعر
 */

import { PRICE_SELECTOR, ALTERNATIVE_SELECTORS, PRICE_ELEMENT_ATTRIBUTES } from './config';

/**
 * التحقق من معقولية سعر الذهب (بين 1800 و 3500 دولار)
 */
export const isReasonableGoldPrice = (price: number): boolean => {
  // تعديل نطاق سعر الذهب المقبول ليتناسب مع التغيرات السوقية
  return price >= 1800 && price <= 3500;
};

/**
 * التحقق من أن العنصر يحتوي على سعر صالح
 */
export const isValidPriceElement = (element: HTMLElement): boolean => {
  if (!element) return false;
  
  // التحقق من النص
  const text = element.textContent?.trim();
  if (!text) return false;
  
  // نمط السعر المحتمل
  const hasPricePattern = /\b(1|2|3)\d{3}(\.\d{1,2})?\b/.test(text) || 
                          PRICE_ELEMENT_ATTRIBUTES.regexPattern.test(text);
  
  if (!hasPricePattern) return false;
  
  // التحقق من الحجم المرئي
  const style = window.getComputedStyle(element);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  const fontSize = parseFloat(style.fontSize);
  
  const hasMinSize = width >= PRICE_ELEMENT_ATTRIBUTES.minWidth && 
                     height >= PRICE_ELEMENT_ATTRIBUTES.minHeight;
  
  const hasMinFontSize = fontSize >= PRICE_ELEMENT_ATTRIBUTES.minFontSize;
  
  // عنصر مرئي
  const isVisible = style.display !== 'none' && 
                    style.visibility !== 'hidden' && 
                    parseFloat(style.opacity) > 0;
  
  return hasPricePattern && hasMinSize && hasMinFontSize && isVisible;
};
