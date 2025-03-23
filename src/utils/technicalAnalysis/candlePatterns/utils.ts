
import { PriceData } from '../indicators/types';

/**
 * حساب طول جسم الشمعة (الفرق بين الفتح والإغلاق)
 */
export function getBodySize(candle: PriceData): number {
  return Math.abs(candle.close - candle.open);
}

/**
 * حساب طول الظل العلوي للشمعة
 */
export function getUpperShadow(candle: PriceData): number {
  return candle.close > candle.open 
    ? candle.high - candle.close 
    : candle.high - candle.open;
}

/**
 * حساب طول الظل السفلي للشمعة
 */
export function getLowerShadow(candle: PriceData): number {
  return candle.close > candle.open 
    ? candle.open - candle.low 
    : candle.close - candle.low;
}

/**
 * حساب إجمالي طول الشمعة (الفرق بين أعلى وأدنى سعر)
 */
export function getCandleSize(candle: PriceData): number {
  return candle.high - candle.low;
}

/**
 * تحديد ما إذا كانت الشمعة صاعدة (خضراء)
 */
export function isBullishCandle(candle: PriceData): boolean {
  return candle.close > candle.open;
}

/**
 * تحديد ما إذا كانت الشمعة هابطة (حمراء)
 */
export function isBearishCandle(candle: PriceData): boolean {
  return candle.close < candle.open;
}

/**
 * تحديد ما إذا كانت الشمعة دوجي (فتح وإغلاق متساويين تقريبًا)
 */
export function isDoji(candle: PriceData, threshold: number = 0.05): boolean {
  const candleSize = getCandleSize(candle);
  const bodySize = getBodySize(candle);
  
  return bodySize <= candleSize * threshold;
}

/**
 * حساب نسبة طول الظل العلوي إلى طول الشمعة الكلي
 */
export function getUpperShadowRatio(candle: PriceData): number {
  const candleSize = getCandleSize(candle);
  
  if (candleSize === 0) return 0;
  
  return getUpperShadow(candle) / candleSize;
}

/**
 * حساب نسبة طول الظل السفلي إلى طول الشمعة الكلي
 */
export function getLowerShadowRatio(candle: PriceData): number {
  const candleSize = getCandleSize(candle);
  
  if (candleSize === 0) return 0;
  
  return getLowerShadow(candle) / candleSize;
}

/**
 * حساب نسبة طول الجسم إلى طول الشمعة الكلي
 */
export function getBodyRatio(candle: PriceData): number {
  const candleSize = getCandleSize(candle);
  
  if (candleSize === 0) return 0;
  
  return getBodySize(candle) / candleSize;
}

/**
 * تحديد ما إذا كانت الشمعة لديها ظل علوي طويل
 */
export function hasLongUpperShadow(candle: PriceData, threshold: number = 0.6): boolean {
  return getUpperShadowRatio(candle) >= threshold;
}

/**
 * تحديد ما إذا كانت الشمعة لديها ظل سفلي طويل
 */
export function hasLongLowerShadow(candle: PriceData, threshold: number = 0.6): boolean {
  return getLowerShadowRatio(candle) >= threshold;
}

/**
 * تحديد ما إذا كان هناك فجوة صعودية بين شمعتين
 */
export function hasGapUp(previousCandle: PriceData, currentCandle: PriceData): boolean {
  return currentCandle.low > previousCandle.high;
}

/**
 * تحديد ما إذا كان هناك فجوة هبوطية بين شمعتين
 */
export function hasGapDown(previousCandle: PriceData, currentCandle: PriceData): boolean {
  return currentCandle.high < previousCandle.low;
}

/**
 * حساب المتوسط المتحرك البسيط
 */
export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    sma.push(sum / period);
  }
  
  return sma;
}

/**
 * تحديد الاتجاه العام للسعر
 */
export function detectTrend(candles: PriceData[], period: number = 14): 'صاعد' | 'هابط' | 'محايد' {
  if (candles.length < period) {
    return 'محايد';
  }
  
  const closingPrices = candles.slice(-period).map(candle => candle.close);
  const sma = calculateSMA(closingPrices, Math.floor(period / 2));
  
  const firstSMA = sma[0];
  const lastSMA = sma[sma.length - 1];
  
  if (lastSMA > firstSMA * 1.01) {
    return 'صاعد';
  } else if (lastSMA < firstSMA * 0.99) {
    return 'هابط';
  } else {
    return 'محايد';
  }
}

/**
 * تحديد قوة النمط بناءً على حجم التداول
 * يفترض أن الحقل volume موجود في كائن PriceData
 */
export function getPatternStrengthByVolume(
  candles: PriceData[], 
  patternStartIndex: number, 
  patternEndIndex: number
): number {
  if (!candles[0].hasOwnProperty('volume')) {
    return 0.5; // قيمة محايدة إذا لم تكن بيانات الحجم متوفرة
  }
  
  // حساب متوسط حجم التداول قبل النمط
  const prePatternCandles = candles.slice(
    Math.max(0, patternStartIndex - 10), 
    patternStartIndex
  );
  
  const patternCandles = candles.slice(patternStartIndex, patternEndIndex + 1);
  
  if (prePatternCandles.length === 0 || patternCandles.length === 0) {
    return 0.5;
  }
  
  // @ts-ignore - نتجاهل خطأ TypeScript لأننا تحققنا من وجود الحقل volume سابقًا
  const avgPreVolume = prePatternCandles.reduce((sum, candle) => sum + candle.volume, 0) / prePatternCandles.length;
  // @ts-ignore
  const avgPatternVolume = patternCandles.reduce((sum, candle) => sum + candle.volume, 0) / patternCandles.length;
  
  // إذا كان حجم التداول خلال النمط أكبر من المتوسط السابق، فهذا يزيد من قوة النمط
  if (avgPatternVolume > avgPreVolume * 1.5) {
    return 0.9; // قوة عالية
  } else if (avgPatternVolume > avgPreVolume * 1.2) {
    return 0.7; // قوة متوسطة
  } else {
    return 0.5; // قوة عادية
  }
}
