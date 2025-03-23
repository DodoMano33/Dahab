
import { PriceData } from '../indicators/types';
import { CandlePatternType, PatternResult } from './types';
import { 
  isDoji, isDragonFlyDoji, isGravestoneDoji, isHammer, isInvertedHammer, 
  isShootingStar, isSpinningTop, isMarubozu, isHangingMan
} from './singleCandlePatterns';
import { 
  isBullishEngulfing, isBearishEngulfing, isBullishHarami, isBearishHarami,
  isPiercingLine, isDarkCloudCover, isTweezerTop, isTweezerBottom
} from './twoCandlePatterns';
import {
  isEveningStar, isMorningStar, isThreeWhiteSoldiers, isThreeBlackCrows,
  isMorningDojiStar, isEveningDojiStar, isAbandonedBaby, isRisingThreeMethods,
  isFallingThreeMethods
} from './threeCandlePatterns';

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
  const patterns: PatternResult[] = [];
  
  if (candles.length === 0) {
    return patterns;
  }
  
  // آخر شمعة للتحليل (أحدث شمعة)
  const currentCandle = candles[candles.length - 1];
  
  // الشموع السابقة للمقارنة
  const prevCandles = candles.slice(0, candles.length - 1);
  
  // فحص أنماط الشمعة المفردة
  checkSingleCandlePatterns(currentCandle, prevCandles, patterns, minConfidence);
  
  // فحص أنماط الشمعتين
  if (candles.length >= 2) {
    checkTwoCandlePatterns(candles, patterns, minConfidence);
  }
  
  // فحص أنماط الثلاث شمعات
  if (candles.length >= 3) {
    checkThreeCandlePatterns(candles, patterns, minConfidence);
  }
  
  // تصنيف الأنماط حسب الثقة
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

/**
 * فحص أنماط الشمعة المفردة
 */
function checkSingleCandlePatterns(
  currentCandle: PriceData,
  prevCandles: PriceData[],
  patterns: PatternResult[],
  minConfidence: number
): void {
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
}

/**
 * فحص أنماط الشمعتين
 */
function checkTwoCandlePatterns(
  candles: PriceData[],
  patterns: PatternResult[],
  minConfidence: number
): void {
  // Bullish Engulfing - نمط الابتلاع الصاعد
  if (isBullishEngulfing(candles)) {
    patterns.push({
      pattern: 'BullishEngulfing',
      signal: 'صاعد',
      confidence: 0.85,
      description: 'نمط الابتلاع الصاعد يشير إلى استعادة المشترين للسيطرة واحتمالية انعكاس السوق للأعلى'
    });
  }
  
  // Bearish Engulfing - نمط الابتلاع الهابط
  if (isBearishEngulfing(candles)) {
    patterns.push({
      pattern: 'BearishEngulfing',
      signal: 'هابط',
      confidence: 0.85,
      description: 'نمط الابتلاع الهابط يشير إلى استعادة البائعين للسيطرة واحتمالية انعكاس السوق للأسفل'
    });
  }
  
  // Bullish Harami - نمط الحمل الصاعد
  if (isBullishHarami(candles)) {
    patterns.push({
      pattern: 'BullishHarami',
      signal: 'صاعد',
      confidence: 0.75,
      description: 'نمط الحمل الصاعد يشير إلى إمكانية انعكاس السوق للأعلى'
    });
  }
  
  // Bearish Harami - نمط الحمل الهابط
  if (isBearishHarami(candles)) {
    patterns.push({
      pattern: 'BearishHarami',
      signal: 'هابط',
      confidence: 0.75,
      description: 'نمط الحمل الهابط يشير إلى إمكانية انعكاس السوق للأسفل'
    });
  }
  
  // Piercing Line - نمط الخط المخترق
  if (isPiercingLine(candles)) {
    patterns.push({
      pattern: 'PiercingLine',
      signal: 'صاعد',
      confidence: 0.75,
      description: 'نمط الخط المخترق يشير إلى تغلب قوى الشراء على قوى البيع واحتمالية انعكاس السوق للأعلى'
    });
  }
  
  // Dark Cloud Cover - نمط السحابة السوداء
  if (isDarkCloudCover(candles)) {
    patterns.push({
      pattern: 'DarkCloudCover',
      signal: 'هابط',
      confidence: 0.75,
      description: 'نمط السحابة السوداء يشير إلى تغلب قوى البيع على قوى الشراء واحتمالية انعكاس السوق للأسفل'
    });
  }
  
  // Tweezer Top - نمط بنسات التلاقي العلوية
  if (isTweezerTop(candles)) {
    patterns.push({
      pattern: 'TweezerTop',
      signal: 'هابط',
      confidence: 0.7,
      description: 'نمط بنسات التلاقي العلوية يشير إلى وصول السعر إلى مستوى مقاومة واحتمالية انعكاس السوق للأسفل'
    });
  }
  
  // Tweezer Bottom - نمط بنسات التلاقي السفلية
  if (isTweezerBottom(candles)) {
    patterns.push({
      pattern: 'TweezerBottom',
      signal: 'صاعد',
      confidence: 0.7,
      description: 'نمط بنسات التلاقي السفلية يشير إلى وصول السعر إلى مستوى دعم واحتمالية انعكاس السوق للأعلى'
    });
  }
}

/**
 * فحص أنماط الثلاث شمعات
 */
function checkThreeCandlePatterns(
  candles: PriceData[],
  patterns: PatternResult[],
  minConfidence: number
): void {
  // Evening Star - نمط نجمة المساء
  if (isEveningStar(candles)) {
    patterns.push({
      pattern: 'EveningStar',
      signal: 'هابط',
      confidence: 0.9,
      description: 'نمط نجمة المساء يشير إلى انتهاء الاتجاه الصاعد واحتمالية كبيرة لانعكاس السوق للأسفل'
    });
  }
  
  // Morning Star - نمط نجمة الصباح
  if (isMorningStar(candles)) {
    patterns.push({
      pattern: 'MorningStar',
      signal: 'صاعد',
      confidence: 0.9,
      description: 'نمط نجمة الصباح يشير إلى انتهاء الاتجاه الهابط واحتمالية كبيرة لانعكاس السوق للأعلى'
    });
  }
  
  // Evening Doji Star - نجمة المساء الدوجي
  if (isEveningDojiStar(candles)) {
    patterns.push({
      pattern: 'EveningDojiStar',
      signal: 'هابط',
      confidence: 0.95,
      description: 'نمط نجمة المساء الدوجي يشير إلى انتهاء الاتجاه الصاعد واحتمالية قوية جدًا لانعكاس السوق للأسفل'
    });
  }
  
  // Morning Doji Star - نجمة الصباح الدوجي
  if (isMorningDojiStar(candles)) {
    patterns.push({
      pattern: 'MorningDojiStar',
      signal: 'صاعد',
      confidence: 0.95,
      description: 'نمط نجمة الصباح الدوجي يشير إلى انتهاء الاتجاه الهابط واحتمالية قوية جدًا لانعكاس السوق للأعلى'
    });
  }
  
  // Three White Soldiers - نمط ثلاثة جنود بيض
  if (isThreeWhiteSoldiers(candles)) {
    patterns.push({
      pattern: 'ThreeWhiteSoldiers',
      signal: 'صاعد',
      confidence: 0.9,
      description: 'نمط ثلاثة جنود بيض يشير إلى قوة المشترين واستمرار الاتجاه الصاعد'
    });
  }
  
  // Three Black Crows - نمط ثلاثة غربان سود
  if (isThreeBlackCrows(candles)) {
    patterns.push({
      pattern: 'ThreeBlackCrows',
      signal: 'هابط',
      confidence: 0.9,
      description: 'نمط ثلاثة غربان سود يشير إلى قوة البائعين واستمرار الاتجاه الهابط'
    });
  }
  
  // Abandoned Baby - نمط الطفل المهجور
  if (isAbandonedBaby(candles)) {
    // تحديد الإشارة بناءً على اتجاه الشمعة الأخيرة
    const lastCandle = candles[candles.length - 1];
    const signal = lastCandle.close > lastCandle.open ? 'صاعد' : 'هابط';
    
    patterns.push({
      pattern: 'AbandonedBaby',
      signal: signal,
      confidence: 0.9,
      description: `نمط الطفل المهجور ${signal === 'صاعد' ? 'الصاعد' : 'الهابط'} يشير إلى انعكاس محتمل للاتجاه`
    });
  }
  
  // Rising Three Methods - نمط الثلاثة طرق الصاعدة
  if (candles.length >= 5 && isRisingThreeMethods(candles)) {
    patterns.push({
      pattern: 'RisingThreeMethods',
      signal: 'صاعد',
      confidence: 0.85,
      description: 'نمط الثلاثة طرق الصاعدة يشير إلى استمرار الاتجاه الصاعد بعد فترة تصحيح مؤقتة'
    });
  }
  
  // Falling Three Methods - نمط الثلاثة طرق الهابطة
  if (candles.length >= 5 && isFallingThreeMethods(candles)) {
    patterns.push({
      pattern: 'FallingThreeMethods',
      signal: 'هابط',
      confidence: 0.85,
      description: 'نمط الثلاثة طرق الهابطة يشير إلى استمرار الاتجاه الهابط بعد فترة تصحيح مؤقتة'
    });
  }
}

/**
 * تحديد الاتجاه السابق للسعر
 */
function detectPreviousTrend(
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
