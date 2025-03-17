
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
    const priceElements = document.querySelectorAll('.chart-container .chart-markup-table.pane-legend-line.main-serie .tv-symbol-price-quote__value, .chart-container .apply-overflow-tooltip.apply-common-tooltip');
    
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
            console.log("تم استخراج السعر من الرسم البياني:", price);
            return price;
          }
        }
      }
    }

    // محاولة ثانية - البحث عن عناصر السعر في ويدجت التكر
    const quoteElements = document.querySelectorAll('.tv-ticker-tape-price__value');
    
    if (quoteElements && quoteElements.length > 0) {
      for (let i = 0; i < quoteElements.length; i++) {
        const priceText = quoteElements[i].textContent;
        if (priceText) {
          // تنظيف النص واستخراج الرقم
          const price = parseFloat(priceText.replace(/[^\d.-]/g, ''));
          if (!isNaN(price)) {
            console.log("تم استخراج السعر من ويدجت TradingView:", price);
            return price;
          }
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
