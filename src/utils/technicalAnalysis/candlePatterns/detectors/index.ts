
import { PriceData } from '../../indicators/types';
import { PatternResult } from '../types';
import { detectSingleCandlePatterns } from './singleCandleDetector';
import { detectTwoCandlePatterns } from './twoCandleDetector';
import { detectThreeCandlePatterns } from './threeCandleDetector';

/**
 * تنفيذ الكشف عن جميع أنماط الشموع وتجميعها
 * @param candles بيانات الشموع للتحليل
 * @param minConfidence الحد الأدنى لنسبة الثقة المطلوبة (0-1)
 * @returns مصفوفة من الأنماط المكتشفة مرتبة حسب نسبة الثقة
 */
export function detectAllPatterns(
  candles: PriceData[],
  minConfidence: number = 0.6
): PatternResult[] {
  if (candles.length === 0) {
    return [];
  }
  
  const patterns: PatternResult[] = [];
  
  // آخر شمعة للتحليل (أحدث شمعة)
  const currentCandle = candles[candles.length - 1];
  
  // الشموع السابقة للمقارنة
  const prevCandles = candles.slice(0, candles.length - 1);
  
  // فحص أنماط الشمعة المفردة
  const singleCandlePatterns = detectSingleCandlePatterns(currentCandle, prevCandles);
  patterns.push(...singleCandlePatterns);
  
  // فحص أنماط الشمعتين
  if (candles.length >= 2) {
    const twoCandlePatterns = detectTwoCandlePatterns(candles);
    patterns.push(...twoCandlePatterns);
  }
  
  // فحص أنماط الثلاث شمعات
  if (candles.length >= 3) {
    const threeCandlePatterns = detectThreeCandlePatterns(candles);
    patterns.push(...threeCandlePatterns);
  }
  
  // تصفية النتائج حسب الثقة المطلوبة
  const filteredPatterns = patterns.filter(pattern => pattern.confidence >= minConfidence);
  
  // تصنيف الأنماط حسب الثقة
  return filteredPatterns.sort((a, b) => b.confidence - a.confidence);
}

export {
  detectSingleCandlePatterns,
  detectTwoCandlePatterns,
  detectThreeCandlePatterns
};
