
/**
 * التحقق من صحة وقيم السعر
 */

import { PRICE_ELEMENT_ATTRIBUTES } from './config';

/**
 * التحقق من أن العنصر صالح لعرض السعر
 */
export const isValidPriceElement = (element: HTMLElement): boolean => {
  if (!element) return false;
  
  // التحقق من النص
  const text = element.textContent?.trim();
  if (!text) return false;
  
  // التحقق من تطابق النص مع نمط السعر
  if (!PRICE_ELEMENT_ATTRIBUTES.regexPattern.test(text)) return false;
  
  // التحقق من الأبعاد المرئية
  const style = window.getComputedStyle(element);
  const width = parseInt(style.width, 10) || 0;
  const height = parseInt(style.height, 10) || 0;
  const fontSize = parseInt(style.fontSize, 10) || 0;
  
  return (
    width >= PRICE_ELEMENT_ATTRIBUTES.minWidth &&
    height >= PRICE_ELEMENT_ATTRIBUTES.minHeight &&
    fontSize >= PRICE_ELEMENT_ATTRIBUTES.minFontSize
  );
};

/**
 * التحقق من معقولية سعر الذهب
 */
export const isReasonableGoldPrice = (price: number): boolean => {
  // نطاق معقول لسعر الذهب (قابل للتعديل)
  return !isNaN(price) && price > 1000 && price < 10000;
};

/**
 * التحقق من أن السعر تغير بشكل كافٍ
 */
export const hasSignificantPriceChange = (oldPrice: number, newPrice: number): boolean => {
  if (oldPrice === newPrice) return false;
  
  // حساب نسبة التغيير
  const changePercentage = Math.abs((newPrice - oldPrice) / oldPrice);
  
  // اعتبار التغيير مهم إذا كان أكثر من 0.01%
  return changePercentage > 0.0001;
};
