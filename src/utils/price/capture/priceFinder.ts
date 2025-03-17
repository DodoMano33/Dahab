
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
      // البحث عن أنماط الأسعار المحتملة
      // 1. رقم عشري مثل 1234.56
      // 2. رقم مع فواصل مثل 1,234.56
      // 3. رقم بسيط مثل 1234
      if (/^[\s$£€¥]*\d{1,5}([.,]\d{1,4})?[\s]*$/.test(text)) {
        elements.push(el as HTMLElement);
      } else if (/\d{1,3}(,\d{3})*\.\d{1,4}/.test(text)) {
        elements.push(el as HTMLElement);
      } else {
        // محاولة استخراج الرقم من النص
        const cleanedText = text.replace(/[^\d.,]/g, '');
        if (cleanedText && /^\d{1,5}([.,]\d{1,4})?$/.test(cleanedText)) {
          elements.push(el as HTMLElement);
        }
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
    
    // التأكد من أنه سعر محتمل للذهب (بين 500 و 5000)
    if (cleanedText) {
      const potentialPrice = parseFloat(cleanedText.replace(',', '.'));
      if (!isNaN(potentialPrice) && potentialPrice > 500 && potentialPrice < 5000) {
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
      }
    } catch (e) {
      // تجاهل أخطاء الوصول عبر المجالات
    }
  }
  
  return null;
};
