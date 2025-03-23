
import { PriceData } from '../../indicators/types';
import { PatternResult } from '../types';
import {
  isEveningStar, isMorningStar, isThreeWhiteSoldiers, isThreeBlackCrows,
  isMorningDojiStar, isEveningDojiStar, isAbandonedBaby, isRisingThreeMethods,
  isFallingThreeMethods
} from '../threeCandlePatterns';

/**
 * فحص أنماط الثلاث شمعات
 * @param candles بيانات الشموع للتحليل
 * @returns مصفوفة من الأنماط المكتشفة
 */
export function detectThreeCandlePatterns(candles: PriceData[]): PatternResult[] {
  if (candles.length < 3) return [];
  
  const patterns: PatternResult[] = [];
  
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
  
  return patterns;
}
