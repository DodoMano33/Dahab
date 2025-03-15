
import html2canvas from 'html2canvas';
import { PRICE_SELECTOR, ALTERNATIVE_SELECTORS, PRICE_ELEMENT_ATTRIBUTES } from './config';
import { getPriceElement, setPriceElement } from './state';

// العثور على عنصر السعر في الشارت باستخدام المحددات المحدثة
export const findPriceElement = (): HTMLElement | null => {
  console.log('البحث عن عنصر السعر باستخدام المحدد الرئيسي:', PRICE_SELECTOR);
  
  // استخدام المحدد الرئيسي أولاً
  let element = document.querySelector(PRICE_SELECTOR) as HTMLElement | null;
  if (element && isValidPriceElement(element)) {
    console.log('تم العثور على عنصر السعر باستخدام المحدد الرئيسي');
    return element;
  }
  
  // محاولة البحث في جميع الإطارات المضمنة
  try {
    const iframes = document.querySelectorAll('iframe');
    for (let i = 0; i < iframes.length; i++) {
      try {
        const iframe = iframes[i];
        if (iframe.contentDocument) {
          element = iframe.contentDocument.querySelector(PRICE_SELECTOR) as HTMLElement | null;
          if (element && isValidPriceElement(element)) {
            console.log('تم العثور على عنصر السعر في الإطار المضمن', i);
            return element;
          }
        }
      } catch (e) {
        // تجاهل أخطاء الوصول عبر المجالات المختلفة
      }
    }
  } catch (error) {
    console.warn('فشل البحث في الإطارات المضمنة:', error);
  }
  
  // محاولة العثور على العنصر باستخدام المحددات البديلة
  console.log('جاري تجربة المحددات البديلة...');
  for (const selector of ALTERNATIVE_SELECTORS) {
    try {
      element = document.querySelector(selector) as HTMLElement | null;
      if (element && isValidPriceElement(element)) {
        console.log('تم العثور على عنصر السعر باستخدام المحدد البديل:', selector);
        return element;
      }
      
      // البحث في جميع الإطارات المضمنة باستخدام المحددات البديلة
      const iframes = document.querySelectorAll('iframe');
      for (let i = 0; i < iframes.length; i++) {
        try {
          const iframe = iframes[i];
          if (iframe.contentDocument) {
            element = iframe.contentDocument.querySelector(selector) as HTMLElement | null;
            if (element && isValidPriceElement(element)) {
              console.log('تم العثور على عنصر السعر في الإطار المضمن', i, 'باستخدام المحدد البديل:', selector);
              return element;
            }
          }
        } catch (e) {
          // تجاهل أخطاء الوصول عبر المجالات المختلفة
        }
      }
    } catch (e) {
      // تجاهل أي أخطاء قد تحدث أثناء تحديد العناصر
    }
  }
  
  // البحث عن عناصر تحتوي على نص يشبه السعر
  console.log('تجربة اختيار العناصر بناءً على محتوى النص...');
  
  // تعريف النمط لتحديد النص الذي يشبه السعر
  const pricePattern = PRICE_ELEMENT_ATTRIBUTES.regexPattern;
  
  // البحث في جميع عناصر span على الصفحة
  const spans = document.querySelectorAll('span, div');
  for (const span of spans) {
    const text = span.textContent?.trim();
    if (text && pricePattern.test(text)) {
      const computedStyle = window.getComputedStyle(span);
      const fontSize = parseInt(computedStyle.fontSize, 10);
      
      // التحقق من حجم الخط للتأكد من أنه قيمة السعر الرئيسية
      if (fontSize >= PRICE_ELEMENT_ATTRIBUTES.minFontSize) {
        console.log('تم العثور على عنصر محتمل للسعر بقيمة:', text);
        return span as HTMLElement;
      }
    }
  }
  
  // البحث في عناصر محددة بشكل أكثر دقة في TradingView
  try {
    const legendItems = document.querySelectorAll('[data-name="legend"]');
    for (const item of legendItems) {
      const valueElements = item.querySelectorAll('[data-name*="value"]');
      for (const el of valueElements) {
        const text = el.textContent?.trim();
        if (text && pricePattern.test(text)) {
          console.log('تم العثور على عنصر محتمل للسعر في legend بقيمة:', text);
          return el as HTMLElement;
        }
      }
    }
  } catch (e) {
    // تجاهل أي أخطاء
  }
  
  console.warn('لم يتم العثور على عنصر السعر باستخدام أي من المحددات');
  return null;
};

// التحقق من صحة عنصر السعر
const isValidPriceElement = (element: HTMLElement): boolean => {
  if (!element) return false;
  
  const text = element.textContent?.trim();
  if (!text) return false;
  
  // التحقق من أن النص يتطابق مع نمط السعر
  if (!PRICE_ELEMENT_ATTRIBUTES.regexPattern.test(text)) {
    return false;
  }
  
  // التحقق من حجم العنصر إذا كان ذا قيمة
  const rect = element.getBoundingClientRect();
  if (rect.width < PRICE_ELEMENT_ATTRIBUTES.minWidth || rect.height < PRICE_ELEMENT_ATTRIBUTES.minHeight) {
    return false;
  }
  
  return true;
};

// التقاط صورة للعنصر
export const captureElement = async (element: HTMLElement): Promise<string> => {
  try {
    console.log('جاري التقاط صورة لعنصر السعر...');
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
    console.log('لا يوجد عنصر سعر مخزن، جاري البحث...');
    element = findPriceElement();
    if (element) {
      console.log('تم العثور على عنصر السعر وتخزينه');
      setPriceElement(element);
    }
  } else {
    // التحقق من صحة العنصر المخزن
    if (!document.body.contains(element) || !isValidPriceElement(element)) {
      console.log('عنصر السعر المخزن غير صالح، جاري البحث عن عنصر جديد...');
      element = findPriceElement();
      if (element) {
        console.log('تم العثور على عنصر السعر الجديد وتخزينه');
        setPriceElement(element);
      } else {
        setPriceElement(null);
      }
    }
  }
  
  return element;
};
