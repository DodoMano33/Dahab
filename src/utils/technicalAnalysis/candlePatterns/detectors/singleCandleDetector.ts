
import { PriceData } from '../../indicators/types';
import { PatternResult } from '../types';
import { 
  isDoji, isDragonFlyDoji, isGravestoneDoji, isHammer, isInvertedHammer, 
  isShootingStar, isSpinningTop, isMarubozu, isHangingMan
} from '../singleCandlePatterns';
import { detectTrend } from '../utils';

/**
 * فحص أنماط الشمعة المفردة
 * @param currentCandle الشمعة الحالية للتحليل
 * @param prevCandles الشموع السابقة للمقارنة
 * @returns مصفوفة من الأنماط المكتشفة
 */
export function detectSingleCandlePatterns(
  currentCandle: PriceData,
  prevCandles: PriceData[]
): PatternResult[] {
  const patterns: PatternResult[] = [];
  
  // Doji - شمعة بدون جسم
  if (isDoji(currentCandle)) {
    patterns.push({
      pattern: 'Doji',
      signal: 'محايد',
      confidence: 0.7,
      description: 'نمط دوجي يشير إلى تردد السوق وعدم وجود اتجاه واضح'
    });
  }
  
  // DragonFly Doji - دوجي طائر التنين
  if (isDragonFlyDoji(currentCandle)) {
    patterns.push({
      pattern: 'DragonFlyDoji',
      signal: 'صاعد',
      confidence: 0.75,
      description: 'دوجي طائر التنين يشير إلى احتمالية انعكاس السوق للأعلى'
    });
  }
  
  // Gravestone Doji - دوجي شاهدة القبر
  if (isGravestoneDoji(currentCandle)) {
    patterns.push({
      pattern: 'GravestoneDoji',
      signal: 'هابط',
      confidence: 0.75,
      description: 'دوجي شاهدة القبر يشير إلى احتمالية انعكاس السوق للأسفل'
    });
  }
  
  // Hammer - نمط المطرقة
  if (isHammer(currentCandle)) {
    // تحديد الإشارة بناءً على الاتجاه السابق
    const prevTrend = detectPreviousTrend(prevCandles, 5);
    const signal = prevTrend === 'هابط' ? 'صاعد' : 'محايد';
    
    patterns.push({
      pattern: 'Hammer',
      signal: signal,
      confidence: signal === 'صاعد' ? 0.8 : 0.6,
      description: 'نمط المطرقة يشير إلى احتمالية انعكاس السوق للأعلى'
    });
  }
  
  // Hanging Man - نمط الرجل المشنوق
  if (isHangingMan(currentCandle, prevCandles)) {
    patterns.push({
      pattern: 'HangingMan',
      signal: 'هابط',
      confidence: 0.75,
      description: 'نمط الرجل المشنوق يظهر في نهاية الاتجاه الصاعد ويشير إلى احتمالية انعكاس السوق للأسفل'
    });
  }
  
  // Inverted Hammer - نمط المطرقة المقلوبة
  if (isInvertedHammer(currentCandle)) {
    // تحديد الإشارة بناءً على الاتجاه السابق
    const prevTrend = detectPreviousTrend(prevCandles, 5);
    const signal = prevTrend === 'هابط' ? 'صاعد' : 'محايد';
    
    patterns.push({
      pattern: 'InvertedHammer',
      signal: signal,
      confidence: signal === 'صاعد' ? 0.7 : 0.5,
      description: 'نمط المطرقة المقلوبة يشير إلى احتمالية انعكاس السوق للأعلى'
    });
  }
  
  // Shooting Star - نمط النجمة الهابطة
  if (isShootingStar(currentCandle, prevCandles)) {
    patterns.push({
      pattern: 'ShootingStar',
      signal: 'هابط',
      confidence: 0.75,
      description: 'نمط النجمة الهابطة يظهر في نهاية الاتجاه الصاعد ويشير إلى احتمالية انعكاس السوق للأسفل'
    });
  }
  
  // Spinning Top - نمط القمة المستديرة
  if (isSpinningTop(currentCandle)) {
    patterns.push({
      pattern: 'SpinningTop',
      signal: 'محايد',
      confidence: 0.6,
      description: 'نمط القمة المستديرة يشير إلى تردد السوق وعدم وجود اتجاه واضح'
    });
  }
  
  // Marubozu - نمط الشمعة الكاملة
  if (isMarubozu(currentCandle)) {
    // تحديد الإشارة بناءً على اتجاه الشمعة
    const signal = currentCandle.close > currentCandle.open ? 'صاعد' : 'هابط';
    
    patterns.push({
      pattern: 'Marubozu',
      signal: signal,
      confidence: 0.8,
      description: `شمعة مارابوزو ${signal === 'صاعد' ? 'صاعدة' : 'هابطة'} تشير إلى قوة المشترين/البائعين واستمرار الاتجاه`
    });
  }
  
  return patterns;
}

/**
 * تحديد الاتجاه السابق للسعر
 */
export function detectPreviousTrend(
  candles: PriceData[], 
  period: number = 5
): 'صاعد' | 'هابط' | 'محايد' {
  if (candles.length < period) {
    return 'محايد';
  }
  
  const lastCandles = candles.slice(-period);
  
  // الشمعة الأولى والأخيرة في الفترة المحددة
  const firstCandle = lastCandles[0];
  const lastCandle = lastCandles[lastCandles.length - 1];
  
  if (lastCandle.close > firstCandle.close * 1.01) {
    return 'صاعد';
  } else if (lastCandle.close < firstCandle.close * 0.99) {
    return 'هابط';
  } else {
    return 'محايد';
  }
}
