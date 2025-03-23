
import { addMinutes, addHours, addDays } from "date-fns";

// وظيفة للحصول على الوقت المتوقع بناءً على الإطار الزمني ومؤشر الهدف
export const getExpectedTime = (timeframe: string, targetIndex: number): Date => {
  const now = new Date();
  const multiplier = targetIndex + 1;

  switch (timeframe) {
    case "1m":
      return addMinutes(now, multiplier * 5);
    case "5m":
      return addMinutes(now, multiplier * 25);
    case "15m":
      return addMinutes(now, multiplier * 75);
    case "30m":
      return addMinutes(now, multiplier * 150);
    case "1h":
      return addHours(now, multiplier * 5);
    case "4h":
      return addHours(now, multiplier * 20);
    case "1d":
      return addDays(now, multiplier * 5);
    case "1w":
      return addDays(now, multiplier * 35);
    default:
      // إطار زمني افتراضي (4 ساعات)
      return addHours(now, multiplier * 20);
  }
};

// حساب المدة المتوقعة بناءً على الإطار الزمني
export const calculateTimeframeBasedDuration = (timeframe: string): number => {
  // الوقت المتوقع بالساعات
  switch (timeframe) {
    case "1m":
      return 1; // ساعة واحدة
    case "5m":
      return 3; // 3 ساعات
    case "15m":
      return 6; // 6 ساعات
    case "30m":
      return 12; // 12 ساعة
    case "1h":
      return 24; // 24 ساعة
    case "4h":
      return 4 * 24; // 4 أيام
    case "1d":
      return 14 * 24; // أسبوعين
    case "1w":
      return 30 * 24; // شهر
    default:
      return 24; // 24 ساعة افتراضياً
  }
};
