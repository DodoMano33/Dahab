
import { TrendDirection } from "./types";
import { calculateATR, calculateVolatility } from "./volatility";

// وظيفة لحساب نقاط وقف الخسارة المُحسّنة
export const calculateOptimalStopLoss = (
  prices: number[],
  direction: TrendDirection,
  riskPercentage: number = 2
): number => {
  try {
    const currentPrice = prices[prices.length - 1];
    
    // حساب التقلب (Volatility) باستخدام الانحراف المعياري
    const volatility = calculateVolatility(prices, 14);
    
    // تحديد نسبة وقف الخسارة بناءً على التقلب والاتجاه
    let stopLossPercentage = riskPercentage;
    
    // زيادة النسبة للأسواق شديدة التقلب
    if (volatility > 0.02) { // تقلب عالٍ
      stopLossPercentage = riskPercentage * 1.5;
    } else if (volatility < 0.01) { // تقلب منخفض
      stopLossPercentage = riskPercentage * 0.8;
    }
    
    // حساب قيمة وقف الخسارة
    const directionStr = direction as string;
    
    if (directionStr === "صاعد") {
      return Number((currentPrice * (1 - stopLossPercentage / 100)).toFixed(2));
    } else if (directionStr === "هابط") {
      return Number((currentPrice * (1 + stopLossPercentage / 100)).toFixed(2));
    } else {
      // للاتجاه المحايد، نستخدم ATR للحصول على مسافة وقف خسارة معقولة
      const atrValue = calculateATR(prices, 14);
      
      if (Math.random() > 0.5) { // تحديد عشوائي للاتجاه في حالة المحايد
        return Number((currentPrice - atrValue * 2).toFixed(2));
      } else {
        return Number((currentPrice + atrValue * 2).toFixed(2));
      }
    }
  } catch (error) {
    console.error("خطأ في حساب وقف الخسارة:", error);
    // قيمة افتراضية في حالة الخطأ
    const currentPrice = prices[prices.length - 1];
    return direction === "صاعد" 
      ? currentPrice * 0.97 
      : currentPrice * 1.03;
  }
};
