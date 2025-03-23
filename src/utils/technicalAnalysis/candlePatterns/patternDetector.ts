
import { PriceData } from '../indicators/types';
import { PatternResult } from './types';
import { detectAllPatterns } from './detectors';

/**
 * تحليل البيانات والكشف عن أنماط الشموع
 * @param candles البيانات التاريخية للشموع
 * @param minConfidence الحد الأدنى من نسبة الثقة المطلوب (0-1)
 * @returns مصفوفة من الأنماط المكتشفة
 */
export function detectCandlePatterns(
  candles: PriceData[], 
  minConfidence: number = 0.6
): PatternResult[] {
  return detectAllPatterns(candles, minConfidence);
}

/**
 * تحليل البيانات وإرجاع النمط الأكثر أهمية فقط
 * @param candles البيانات التاريخية للشموع
 * @param minConfidence الحد الأدنى من نسبة الثقة المطلوب (0-1)
 * @returns أهم نمط مكتشف أو null إذا لم يتم اكتشاف أي نمط
 */
export function detectMostSignificantPattern(
  candles: PriceData[], 
  minConfidence: number = 0.6
): PatternResult | null {
  const patterns = detectCandlePatterns(candles, minConfidence);
  
  if (patterns.length === 0) {
    return null;
  }
  
  // إرجاع النمط ذو الثقة الأعلى
  return patterns[0];
}
