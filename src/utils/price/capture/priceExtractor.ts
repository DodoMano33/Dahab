
/**
 * استخراج السعر من الرسم البياني
 */
import { extractPriceFromTradingView } from "@/utils/tradingViewUtils";

/**
 * استخراج السعر الحالي من الرسم البياني - مُعطّل حاليًا وسيتم استخدام سعر الصورة فقط
 * @returns وعد يحتوي على السعر الحالي أو null في حالة الفشل
 */
export const extractPriceFromChart = async (): Promise<number | null> => {
  // معطل - سنعتمد فقط على السعر المستخرج من الصورة
  console.log("تم تعطيل استخراج السعر من الرسم البياني - سنعتمد على السعر المستخرج من الصورة فقط");
  return null;
};
