
import html2canvas from 'html2canvas';
import { PRICE_SELECTOR, ALTERNATIVE_SELECTORS } from './config';
import { getPriceElement, setPriceElement } from './state';

// العثور على عنصر السعر في الشارت باستخدام المحددات المحدثة
export const findPriceElement = (): HTMLElement | null => {
  console.log('البحث عن عنصر السعر باستخدام المحدد الرئيسي:', PRICE_SELECTOR);
  
  // استخدام المحدد الرئيسي أولاً
  let element = document.querySelector(PRICE_SELECTOR) as HTMLElement | null;
  if (element) {
    console.log('تم العثور على عنصر السعر باستخدام المحدد الرئيسي');
    return element;
  }
  
  // البحث في الإطار المضمن إذا كان موجوداً
  try {
    const iframe = document.querySelector('#tv_chart_container iframe') as HTMLIFrameElement | null;
    if (iframe && iframe.contentDocument) {
      element = iframe.contentDocument.querySelector(PRICE_SELECTOR) as HTMLElement | null;
      if (element) {
        console.log('تم العثور على عنصر السعر في الإطار المضمن');
        return element;
      }
    }
  } catch (error) {
    console.warn('فشل البحث في الإطار المضمن:', error);
  }
  
  // محاولة العثور على العنصر باستخدام المحددات البديلة
  console.log('جاري تجربة المحددات البديلة...');
  for (const selector of ALTERNATIVE_SELECTORS) {
    element = document.querySelector(selector) as HTMLElement | null;
    if (element) {
      console.log('تم العثور على عنصر السعر باستخدام المحدد البديل:', selector);
      return element;
    }
    
    // البحث في الإطار المضمن باستخدام المحددات البديلة
    try {
      const iframe = document.querySelector('#tv_chart_container iframe') as HTMLIFrameElement | null;
      if (iframe && iframe.contentDocument) {
        element = iframe.contentDocument.querySelector(selector) as HTMLElement | null;
        if (element) {
          console.log('تم العثور على عنصر السعر في الإطار المضمن باستخدام المحدد البديل:', selector);
          return element;
        }
      }
    } catch (error) {
      // تجاهل أخطاء الوصول عبر المجالات المختلفة
    }
  }
  
  // البحث باستخدام المحددات المرئية المنطقية
  console.log('تجربة اختيار العناصر مرئياً...');
  const visibleElements = document.querySelectorAll('.tv-chart-cont span, .tv-chart span, #tv_chart_container span');
  for (const el of visibleElements) {
    const text = el.textContent?.trim();
    if (text && /^\d{1,5}(\.\d{1,2})?$/.test(text)) {
      console.log('تم العثور على عنصر يحتوي على نص يشبه السعر:', text);
      return el as HTMLElement;
    }
  }
  
  console.warn('لم يتم العثور على عنصر السعر باستخدام أي من المحددات');
  return null;
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
  }
  
  return element;
};
