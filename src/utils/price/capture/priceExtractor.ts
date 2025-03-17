
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
    // استخدام الدالة الموجودة في ملف tradingViewUtils
    return await extractPriceFromTradingView();
  } catch (error) {
    console.error("فشل في استخراج السعر من الرسم البياني:", error);
    return null;
  }
};
