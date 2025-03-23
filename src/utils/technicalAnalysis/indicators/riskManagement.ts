
import { calculateATR } from "./volatility";
import { PriceData } from "./types";

/**
 * حساب وقف الخسارة الأمثل باستخدام ATR
 * @param currentPrice السعر الحالي
 * @param direction اتجاه الصفقة
 * @param data بيانات الأسعار
 * @param multiplier مضاعف ATR
 * @returns سعر وقف الخسارة المحسوب
 */
export const calculateOptimalStopLoss = (
  currentPrice: number,
  direction: "صاعد" | "هابط" | "محايد",
  data: PriceData[],
  multiplier: number = 2
): number => {
  try {
    // حساب ATR
    const atr = calculateATR(data);
    
    // حساب وقف الخسارة بناءً على الاتجاه
    if (direction === "صاعد") {
      // للصفقات الشرائية، وقف الخسارة أقل من سعر الدخول
      return parseFloat((currentPrice - (atr * multiplier)).toFixed(2));
    } else {
      // للصفقات البيعية، وقف الخسارة أعلى من سعر الدخول
      return parseFloat((currentPrice + (atr * multiplier)).toFixed(2));
    }
  } catch (error) {
    console.error("خطأ في حساب وقف الخسارة الأمثل:", error);
    
    // العودة إلى حساب بديل في حالة حدوث خطأ
    if (direction === "صاعد") {
      return parseFloat((currentPrice * 0.97).toFixed(2)); // 3% أقل من السعر الحالي
    } else {
      return parseFloat((currentPrice * 1.03).toFixed(2)); // 3% أعلى من السعر الحالي
    }
  }
};

/**
 * حساب نسبة المخاطرة إلى العائد
 * @param entryPrice سعر الدخول
 * @param stopLoss سعر وقف الخسارة
 * @param target سعر الهدف
 * @returns نسبة المخاطرة إلى العائد
 */
export const calculateRiskRewardRatio = (
  entryPrice: number,
  stopLoss: number,
  target: number
): number => {
  try {
    // التأكد من أن القيم صحيحة
    if (isNaN(entryPrice) || isNaN(stopLoss) || isNaN(target)) {
      console.warn("قيم غير صالحة لحساب نسبة المخاطرة إلى العائد", { entryPrice, stopLoss, target });
      return 0;
    }
    
    // حساب المخاطرة (الخسارة المحتملة)
    const risk = Math.abs(entryPrice - stopLoss);
    
    // حساب العائد (الربح المحتمل)
    const reward = Math.abs(target - entryPrice);
    
    // حساب النسبة
    if (risk === 0) return 0; // تجنب القسمة على الصفر
    
    return parseFloat((reward / risk).toFixed(2));
  } catch (error) {
    console.error("خطأ في حساب نسبة المخاطرة إلى العائد:", error);
    return 0;
  }
};

/**
 * حساب الحجم المثالي للصفقة بناءً على إدارة المخاطر
 * @param accountBalance رصيد الحساب
 * @param riskPercentage نسبة المخاطرة المسموح بها (بالنسبة المئوية)
 * @param entryPrice سعر الدخول
 * @param stopLoss سعر وقف الخسارة
 * @returns الحجم المثالي للصفقة
 */
export const calculateOptimalPositionSize = (
  accountBalance: number,
  riskPercentage: number,
  entryPrice: number,
  stopLoss: number
): number => {
  try {
    // التأكد من أن القيم صحيحة
    if (isNaN(accountBalance) || isNaN(riskPercentage) || isNaN(entryPrice) || isNaN(stopLoss)) {
      console.warn("قيم غير صالحة لحساب حجم الصفقة المثالي", { accountBalance, riskPercentage, entryPrice, stopLoss });
      return 0;
    }
    
    // حساب المبلغ المسموح بالمخاطرة به
    const riskAmount = accountBalance * (riskPercentage / 100);
    
    // حساب الفرق بين سعر الدخول ووقف الخسارة
    const priceDifference = Math.abs(entryPrice - stopLoss);
    
    // حساب نسبة الفرق
    const percentageDifference = priceDifference / entryPrice;
    
    // حساب الحجم المثالي
    const optimalSize = riskAmount / (entryPrice * percentageDifference);
    
    return parseFloat(optimalSize.toFixed(2));
  } catch (error) {
    console.error("خطأ في حساب حجم الصفقة المثالي:", error);
    return 0;
  }
};
