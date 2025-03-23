
import {
  calculateSupportResistance as calculateSR
} from "../indicators";
import { calculateFibonacciLevels } from "./fibonacci";
import { calculateVolatility } from "./volatility";
import { TrendDirection } from "./types";

// استيراد مؤشرات تحليل الاتجاه والتقلب
import { detectTrend as detectTrendFromIndicators } from "./trendIndicators";

/**
 * اكتشاف اتجاه السعر من البيانات التاريخية
 * @param prices بيانات الأسعار التاريخية
 * @param period فترة الحساب
 * @returns اتجاه السعر (صاعد، هابط، محايد)
 */
export const detectTrend = (
  prices: number[], 
  period: number = 14
): TrendDirection => {
  // استخدام مؤشرات الاتجاه للكشف عن الاتجاه
  return detectTrendFromIndicators(prices, period);
};

/**
 * حساب مستويات الدعم والمقاومة
 * @param prices بيانات الأسعار التاريخية
 * @returns مستويات الدعم والمقاومة
 */
export const calculateSupportResistance = (
  prices: number[]
): { support: number, resistance: number } => {
  return calculateSR(prices);
};

/**
 * حساب مستويات فيبوناتشي
 * @param support مستوى الدعم
 * @param resistance مستوى المقاومة
 * @param direction اتجاه السوق
 * @returns مستويات فيبوناتشي
 */
export const calculateFibonacciLevels = (
  support: number, 
  resistance: number, 
  direction: TrendDirection = "صاعد"
): { level: number; price: number }[] => {
  return calculateFibonacciLevels(resistance, support, direction);
};

/**
 * حساب نسبة التقلب
 * @param prices بيانات الأسعار التاريخية
 * @param period فترة الحساب
 * @returns نسبة التقلب (نسبة مئوية)
 */
export const calculateVolatility = (
  prices: number[], 
  period: number = 20
): number => {
  return calculateVolatility(prices, period);
};
