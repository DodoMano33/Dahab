
import html2canvas from 'html2canvas';
import { PRICE_SELECTOR, ALTERNATIVE_SELECTORS, PRICE_ELEMENT_ATTRIBUTES } from './config';
import { getPriceElement, setPriceElement } from './state';

// تحسين العثور على عنصر السعر في الشارت
export const findPriceElement = (): HTMLElement | null => {
  console.log('البحث عن عنصر السعر باستخدام المحدد الرئيسي:', PRICE_SELECTOR);
  
  // 1. محاولة العثور على المحدد الرئيسي
  let element = document.querySelector(PRICE_SELECTOR) as HTMLElement | null;
  if (element && isValidPriceElement(element)) {
    console.log('تم العثور على عنصر السعر باستخدام المحدد الرئيسي');
    return element;
  }
  
  // 2. البحث في جميع الإطارات المضمنة
  const iframes = document.querySelectorAll('iframe');
  for (let i = 0; i < iframes.length; i++) {
    try {
      const iframe = iframes[i];
      if (iframe.contentDocument) {
        // البحث في الإطار باستخدام المحدد الرئيسي
        element = iframe.contentDocument.querySelector(PRICE_SELECTOR) as HTMLElement | null;
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

// التحقق من صلاحية عنصر السعر
const isValidPriceElement = (element: HTMLElement): boolean => {
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

// البحث عن العناصر التي تحتوي على نص يشبه السعر
const findElementsWithPriceText = (): HTMLElement[] => {
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

// اختيار أفضل عنصر سعر من قائمة العناصر المحتملة
const findBestPriceElement = (elements: HTMLElement[]): HTMLElement | null => {
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

// التقاط صورة للعنصر
export const captureElement = async (element: HTMLElement): Promise<string> => {
  try {
    console.log('جاري التقاط صورة لعنصر السعر...');
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      logging: false,
      scale: 3, // زيادة الدقة للحصول على نتائج OCR أفضل
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
