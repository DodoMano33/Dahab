
import { TrendDirection } from "./types";

// وظيفة لحساب مستويات فيبوناتشي
export const calculateFibonacciLevels = (
  highPrice: number,
  lowPrice: number,
  direction: TrendDirection = "صاعد"
): { level: number; price: number }[] => {
  // مستويات فيبوناتشي الرئيسية
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.27, 1.618];
  const range = highPrice - lowPrice;
  
  return fibLevels.map(level => {
    let price;
    // استخدام المتغير كنص للمقارنة لحل مشكلة الأنواع
    const directionStr = direction as string;
    
    if (directionStr === "صاعد") {
      // للاتجاه الصاعد، نحسب المستويات تصاعديًا من أدنى سعر
      price = lowPrice + (range * level);
    } else if (directionStr === "هابط") {
      // للاتجاه الهابط، نحسب المستويات تنازليًا من أعلى سعر
      price = highPrice - (range * level);
    } else {
      // للاتجاه المحايد، نحسب من منتصف النطاق
      const midPrice = (highPrice + lowPrice) / 2;
      price = midPrice + (range * (level - 0.5));
    }
    
    return { level, price: Number(price.toFixed(2)) };
  });
};
