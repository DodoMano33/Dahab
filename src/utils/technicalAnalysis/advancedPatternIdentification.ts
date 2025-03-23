
import { addDays } from "date-fns";

// تحديد الأنماط السعرية المتقدمة
export const identifyAdvancedPricePatterns = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
) => {
  console.log("تحديد الأنماط السعرية المتقدمة للشارت:", { timeframe, currentPrice });
  
  try {
    // في النظام الحقيقي، سيتم استخدام خوارزميات متقدمة للتعرف على الأنماط
    // مثل تحليل الشبكات العصبية أو خوارزميات تعلم الآلة
    
    // إذا لم تتوفر خدمة API للتحليل، يمكن إرجاع null
    console.log("تحذير: تحديد الأنماط المتقدمة يتطلب خدمة API للتحليل الفني");
    
    return null;
  } catch (error) {
    console.error("خطأ في تحديد الأنماط المتقدمة:", error);
    return null;
  }
};

// وظيفة مساعدة - حساب نسبة فيبوناتشي لإعادة الاختبار
export const calculateRetracementLevels = (high: number, low: number) => {
  const range = high - low;
  return {
    "0.236": low + range * 0.236,
    "0.382": low + range * 0.382,
    "0.5": low + range * 0.5,
    "0.618": low + range * 0.618,
    "0.786": low + range * 0.786
  };
};

// وظيفة مساعدة - التحقق من وجود نمط رأس وكتفين
export const checkHeadAndShoulders = (peaks: number[], valleys: number[], threshold: number = 0.05) => {
  // تحتاج إلى 3 قمم و2 قيعان على الأقل
  if (peaks.length < 3 || valleys.length < 2) {
    return false;
  }
  
  // ترتيب القمم والقيعان حسب الوقت
  const sortedPeaks = [...peaks].sort((a, b) => a - b);
  const leftShoulder = sortedPeaks[0];
  const head = sortedPeaks[sortedPeaks.length - 1];
  const rightShoulder = sortedPeaks[1];
  
  // التحقق من أن الرأس أعلى من الكتفين
  if (head <= leftShoulder || head <= rightShoulder) {
    return false;
  }
  
  // التحقق من أن الكتفين في مستوى متشابه تقريبًا
  const shoulderDiff = Math.abs(leftShoulder - rightShoulder) / leftShoulder;
  if (shoulderDiff > threshold) {
    return false;
  }
  
  return true;
};

// وظيفة مساعدة - التحقق من وجود نمط القاع المزدوج
export const checkDoubleBottom = (valleys: number[], threshold: number = 0.05) => {
  // تحتاج إلى قيعان على الأقل
  if (valleys.length < 2) {
    return false;
  }
  
  // ترتيب القيعان حسب الوقت
  const sortedValleys = [...valleys].sort((a, b) => a - b);
  const firstBottom = sortedValleys[0];
  const secondBottom = sortedValleys[1];
  
  // التحقق من أن القيعان في مستوى متشابه تقريبًا
  const bottomDiff = Math.abs(firstBottom - secondBottom) / firstBottom;
  if (bottomDiff > threshold) {
    return false;
  }
  
  return true;
};
