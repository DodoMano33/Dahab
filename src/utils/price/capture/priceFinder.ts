
import { isValidPriceElement } from './validators';
import { ALTERNATIVE_SELECTORS, PRICE_SELECTOR } from './config';

/**
 * البحث عن العناصر التي تحتوي على نص يشبه السعر
 */
export const findElementsWithPriceText = (): HTMLElement[] => {
  const elements: HTMLElement[] = [];
  
  // البحث في span و div لأنها غالبًا ما تستخدم لعرض الأسعار
  const potentialElements = document.querySelectorAll('span, div, p, strong, b');
  
  potentialElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text) {
      // البحث عن نمط سعر الذهب كما يظهر في الصورة المرفقة (مثل 2,991.490)
      if (/\b[1-3][\d,]{3,6}\.\d{1,3}\b/.test(text)) {
        elements.push(el as HTMLElement);
      } else if (/\d{1,4}([.,]\d{1,4})?/.test(text)) {
        // نمط أبسط للأرقام التي قد تكون أسعار
        elements.push(el as HTMLElement);
      }
    }
  });
  
  return elements;
};

/**
 * اختيار أفضل عنصر سعر من قائمة العناصر المحتملة
 */
export const findBestPriceElement = (elements: HTMLElement[]): HTMLElement | null => {
  if (elements.length === 0) return null;
  
  // فلترة العناصر التي لا تحتوي على سعر حقيقي
  const validElements = elements.filter(el => {
    const text = el.textContent?.trim() || '';
    
    // تنظيف النص
    const cleanedText = text.replace(/[^\d.,]/g, '');
    
    // التأكد من أنه سعر محتمل للذهب (بين 1800 و 3500)
    if (cleanedText) {
      const potentialPrice = parseFloat(cleanedText.replace(',', '.'));
      if (!isNaN(potentialPrice) && potentialPrice >= 1800 && potentialPrice <= 3500) {
        return true;
      }
    }
    
    return false;
  });
  
  if (validElements.length > 0) {
    // ترتيب العناصر حسب حجم الخط (الأكبر أولاً)
    return validElements.sort((a, b) => {
      const styleA = window.getComputedStyle(a);
      const styleB = window.getComputedStyle(b);
      const fontSizeA = parseInt(styleA.fontSize, 10);
      const fontSizeB = parseInt(styleB.fontSize, 10);
      return fontSizeB - fontSizeA;
    })[0];
  }
  
  // إذا لم يكن هناك عناصر صالحة تلبي متطلبات الذهب، نعود إلى معايير أبسط
  return elements.sort((a, b) => {
    const styleA = window.getComputedStyle(a);
    const styleB = window.getComputedStyle(b);
    const fontSizeA = parseInt(styleA.fontSize, 10);
    const fontSizeB = parseInt(styleB.fontSize, 10);
    return fontSizeB - fontSizeA;
  })[0];
};

/**
 * البحث في الأطر المضمنة (iframes)
 */
export const searchInIframes = (): HTMLElement | null => {
  const iframes = document.querySelectorAll('iframe');
  for (let i = 0; i < iframes.length; i++) {
    try {
      const iframe = iframes[i];
      if (iframe.contentDocument) {
        // البحث في الإطار باستخدام المحدد الرئيسي
        let element = iframe.contentDocument.querySelector(PRICE_SELECTOR) as HTMLElement | null;
        if (element && isValidPriceElement(element)) {
          console.log(`تم العثور على عنصر السعر في الإطار ${i}`);
          return element;
        }
        
        // تجربة المحددات البديلة في الإطار
        for (const selector of ALTERNATIVE_SELECTORS) {
          element = iframe.contentDocument.querySelector(selector) as HTMLElement | null;
          if (element && isValidPriceElement(element)) {
            console.log(`تم العثور على عنصر السعر في الإطار ${i} باستخدام المحدد: ${selector}`);
            return element;
          }
        }
        
        // البحث عن نمط سعر الذهب في الإطار كما يظهر في الصورة
        const allElements = iframe.contentDocument.querySelectorAll('*');
        for (const el of allElements) {
          const text = el.textContent?.trim();
          if (text && /\b[1-3][\d,]{3,6}\.\d{1,3}\b/.test(text)) {
            console.log(`تم العثور على نص يشبه سعر الذهب في الإطار ${i}: ${text}`);
            return el as HTMLElement;
          }
        }
      }
    } catch (e) {
      // تجاهل أخطاء الوصول عبر المجالات
    }
  }
  
  return null;
};
