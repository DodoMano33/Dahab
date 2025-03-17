
/**
 * استخراج السعر من الرسم البياني
 */
import { extractPriceFromTradingView } from "@/utils/tradingViewUtils";

/**
 * استخراج السعر الحالي من الرسم البياني
 * @returns وعد يحتوي على السعر الحالي أو null في حالة الفشل
 */
export const extractPriceFromChart = async (): Promise<number | null> => {
  try {
    // محاولة استخراج السعر من عناصر DOM الخاصة بالويدجت
    // البحث عن العناصر التي تحتوي على الرقم الكبير المعروض (سعر العملة الحالي)
    const priceElements = document.querySelectorAll('.chart-container .chart-markup-table.pane-legend-line.main-serie .tv-symbol-price-quote__value, .chart-container .apply-overflow-tooltip.apply-common-tooltip, .tv-ticker-tape-price__value');
    
    if (priceElements && priceElements.length > 0) {
      // تجربة كل عنصر محتمل حتى نجد السعر
      for (let i = 0; i < priceElements.length; i++) {
        const priceText = priceElements[i].textContent;
        if (priceText) {
          // تنظيف النص واستخراج الرقم
          const cleanText = priceText.replace(/[^\d.,]/g, '');
          // التعامل مع الفاصلة والنقطة في تنسيقات الأرقام المختلفة
          const normalizedText = cleanText.replace(/,/g, '.');
          const price = parseFloat(normalizedText);
          
          if (!isNaN(price) && price > 0) {
            console.log("تم استخراج السعر من DOM:", price);
            return price;
          }
        }
      }
    }

    // محاولة ثانية - البحث عن عناصر السعر في ويدجيت التكر
    const quoteElements = document.querySelectorAll('.tv-ticker-tape-price__value');
    
    if (quoteElements && quoteElements.length > 0) {
      for (let i = 0; i < quoteElements.length; i++) {
        const priceText = quoteElements[i].textContent;
        if (priceText) {
          // تنظيف النص واستخراج الرقم
          const cleanText = priceText.replace(/[^\d.,]/g, '');
          const normalizedText = cleanText.replace(/,/g, '.');
          const price = parseFloat(normalizedText);
          
          if (!isNaN(price) && price > 0) {
            console.log("تم استخراج السعر من ويدجيت التكر:", price);
            return price;
          }
        }
      }
    }
    
    // محاولة ثالثة - البحث عن عناصر بقيمة رقمية في أي مكان في DOM
    const allElementsWithText = document.querySelectorAll('div, span, p');
    for (let i = 0; i < allElementsWithText.length; i++) {
      const element = allElementsWithText[i];
      if (element.textContent && element.textContent.match(/^\s*[\d,]+\.\d+\s*$/)) {
        const priceText = element.textContent;
        const cleanText = priceText.replace(/[^\d.,]/g, '');
        const normalizedText = cleanText.replace(/,/g, '.');
        const price = parseFloat(normalizedText);
        
        if (!isNaN(price) && price > 0) {
          console.log("تم استخراج السعر من عنصر DOM عام:", price);
          return price;
        }
      }
    }
    
    // إذا فشلت كل المحاولات، نستخدم الطريقة الاحتياطية
    return await extractPriceFromTradingView();
  } catch (error) {
    console.error("فشل في استخراج السعر من الرسم البياني:", error);
    return null;
  }
};
