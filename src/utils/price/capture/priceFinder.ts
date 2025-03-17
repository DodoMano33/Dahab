
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
      if (/^[\s$£€¥]*\d{1,4}([.,]\d{1,2})?[\s]*$/.test(text)) {
        // تحويل النص إلى رقم للتحقق من نطاق سعر الذهب
        const numText = text.replace(/[^\d.,]/g, '').replace(',', '.');
        const num = parseFloat(numText);
        if (!isNaN(num) && num >= 1800 && num <= 3500) {
          console.log(`تم العثور على نص يشبه سعر الذهب: ${text}`);
          elements.push(el as HTMLElement);
        }
      } else if (/\d{1,4}[.,]\d{1,2}/.test(text) || /\b[1-3]\d{3}\b/.test(text)) {
        // البحث عن أرقام في نطاق الذهب سواء كانت بفاصلة عشرية أو بدون
        const matches = text.match(/\d{1,4}[.,]\d{1,2}|\b[1-3]\d{3}\b/g);
        if (matches) {
          for (const match of matches) {
            const num = parseFloat(match.replace(',', '.'));
            if (!isNaN(num) && num >= 1800 && num <= 3500) {
              console.log(`تم العثور على سعر ذهب محتمل في النص: ${text}, القيمة: ${num}`);
              elements.push(el as HTMLElement);
              break;
            }
          }
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
    // البحث عن العناصر ذات الخلفية الملونة أولاً
    const coloredElements = validElements.filter(el => {
      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;
      const textColor = style.color;
      
      // التحقق من وجود لون خلفية أو لون نص مميز
      return (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') ||
             (textColor === 'rgb(255, 255, 255)'); // النص الأبيض كما ذكر المستخدم
    });
    
    if (coloredElements.length > 0) {
      console.log(`تم العثور على ${coloredElements.length} عناصر ملونة تحتوي على سعر محتمل`);
      return coloredElements[0];
    }
    
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

/**
 * البحث عن السعر في الشريط الملون (كما ذكر المستخدم)
 */
export const findPriceInColoredBar = (): HTMLElement | null => {
  console.log('البحث عن السعر في الشريط الملون (أحمر/أخضر)...');
  
  // البحث عن العناصر المرئية ذات الخلفية الملونة
  const allElements = document.querySelectorAll('*');
  const coloredElements: HTMLElement[] = [];
  
  allElements.forEach(el => {
    const style = window.getComputedStyle(el as HTMLElement);
    const bgColor = style.backgroundColor;
    
    // التحقق من وجود خلفية حمراء أو خضراء
    const isRed = /rgba?\((\d*),\s*(\d*),\s*(\d*)/i.test(bgColor) && 
                 parseInt(RegExp.$1) > 100 && parseInt(RegExp.$2) < 100;
    
    const isGreen = /rgba?\((\d*),\s*(\d*),\s*(\d*)/i.test(bgColor) && 
                   parseInt(RegExp.$2) > 100 && parseInt(RegExp.$1) < 100;
    
    if (isRed || isGreen) {
      // التحقق من محتوى النص
      const text = el.textContent?.trim();
      if (text && /\d/.test(text)) {
        console.log(`تم العثور على عنصر ملون بنص: ${text}`);
        coloredElements.push(el as HTMLElement);
      }
    }
  });
  
  // فحص العناصر الملونة للعثور على سعر محتمل
  for (const el of coloredElements) {
    const text = el.textContent?.trim() || '';
    const matches = text.match(/\d{1,4}([.,]\d{1,2})?|\b[1-3]\d{3}\b/g);
    
    if (matches) {
      for (const match of matches) {
        const num = parseFloat(match.replace(',', '.'));
        if (!isNaN(num) && num >= 1800 && num <= 3500) {
          console.log(`تم العثور على سعر ذهب في شريط ملون: ${num}`);
          return el as HTMLElement;
        }
      }
    }
  }
  
  console.log('لم يتم العثور على سعر في أي شريط ملون');
  return null;
};
