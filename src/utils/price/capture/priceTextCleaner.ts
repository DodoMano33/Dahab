
/**
 * وحدة معالجة وتنظيف نص السعر
 */

/**
 * تنظيف نص السعر باستخدام طرق متعددة
 */
export const cleanPriceText = (text: string): string => {
  if (!text) return '';
  
  // 1. إزالة كل الأحرف ما عدا الأرقام والنقطة العشرية والفاصلة
  let cleanText = text.replace(/[^\d.,]/g, '');
  
  // 2. التعامل مع الفواصل والنقاط بناءً على سياق النص
  if (cleanText.includes(',') && cleanText.includes('.')) {
    // إذا كان النص يحتوي على نقطة وفاصلة، افترض أن التنسيق هو 1,234.56
    const parts = cleanText.split('.');
    if (parts.length > 1 && parts[1].length <= 4) {
      // الاحتفاظ بالنقطة العشرية وإزالة الفواصل
      cleanText = parts[0].replace(/,/g, '') + '.' + parts[1];
    } else {
      // ربما الفاصلة هي العلامة العشرية والنقطة للآلاف
      cleanText = cleanText.replace(/\./g, '').replace(',', '.');
    }
  } else if (cleanText.includes(',')) {
    // إذا كان النص يحتوي على فاصلة فقط
    // افحص إذا كانت الفاصلة تُستخدم كعلامة عشرية (مثل 1234,56)
    if (cleanText.split(',')[1]?.length <= 4) {
      cleanText = cleanText.replace(',', '.');
    } else {
      // الفاصلة تُستخدم للآلاف (مثل 1,234)
      cleanText = cleanText.replace(/,/g, '');
    }
  }
  
  // 3. التأكد من وجود نقطة عشرية واحدة فقط
  if (cleanText.includes('.')) {
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      // أخذ أول رقم والجزء العشري
      cleanText = parts[0] + '.' + parts[1];
    }
  }
  
  return cleanText;
};
