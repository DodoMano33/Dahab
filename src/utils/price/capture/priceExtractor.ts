
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
    
    // إذا فشل استخراج السعر من الويدجت، نستخدم الطريقة البديلة
    return await extractPriceFromTradingView();
  } catch (error) {
    console.error("فشل في استخراج السعر من الرسم البياني:", error);
    return null;
  }
};
