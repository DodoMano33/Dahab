
import html2canvas from 'html2canvas';
import { PRICE_SELECTOR, ALTERNATIVE_SELECTORS } from './config';
import { getPriceElement, setPriceElement } from './state';

// العثور على عنصر السعر في الشارت
export const findPriceElement = (): HTMLElement | null => {
  // استخدام المحدد الرئيسي أولاً
  const elements = document.querySelectorAll(PRICE_SELECTOR);
  if (elements.length > 0) {
    return elements[0] as HTMLElement;
  }
  
  // محاولة العثور على العنصر بطرق بديلة
  for (const selector of ALTERNATIVE_SELECTORS) {
    const element = document.querySelector(selector);
    if (element) {
      return element as HTMLElement;
    }
  }
  
  return null;
};

// التقاط صورة للعنصر
export const captureElement = async (element: HTMLElement): Promise<string> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      logging: false,
      scale: 2, // مقياس أعلى للحصول على دقة أفضل للـ OCR
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('فشل في التقاط صورة للعنصر:', error);
    throw error;
  }
};

// الحصول على عنصر السعر أو البحث عنه إذا لم يكن موجودًا
export const getPriceElementOrFind = (): HTMLElement | null => {
  let element = getPriceElement();
  
  // إذا لم يكن العنصر موجودًا، ابحث عنه
  if (!element) {
    element = findPriceElement();
    setPriceElement(element);
  }
  
  return element;
};
