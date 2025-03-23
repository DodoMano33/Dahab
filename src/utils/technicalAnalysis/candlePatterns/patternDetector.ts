
import { PriceData } from '../indicators/types';
import { PatternResult } from './types';
import { 
  isDoji, isHammer, isInvertedHammer, isShootingStar, 
  isDragonFlyDoji, isGravestoneDoji, isSpinningTop, isMarubozu 
} from './singleCandlePatterns';
import { 
  isBullishEngulfing, isBearishEngulfing, 
  isBullishHarami, isBearishHarami,
  isPiercingLine, isDarkCloudCover
} from './twoCandlePatterns';
import {
  isEveningStar, isMorningStar,
  isThreeWhiteSoldiers, isThreeBlackCrows
} from './threeCandlePatterns';

// الوظيفة الرئيسية للكشف عن أنماط الشموع
export const detectCandlePatterns = (data: PriceData[]): PatternResult[] => {
  if (data.length < 3) {
    return [];
  }
  
  const patterns: PatternResult[] = [];
  const lastCandle = data[data.length - 1];
  const lastTwoCandles = data.slice(-2);
  const lastThreeCandles = data.slice(-3);
  
  // التحقق من الأنماط المختلفة
  
  // أنماط الشمعة الواحدة
  if (isDoji(lastCandle)) {
    patterns.push({
      pattern: 'Doji',
      signal: 'محايد',
      confidence: 0.6,
      description: 'شمعة دوجي تشير إلى التردد في السوق وقد تكون علامة على انعكاس محتمل'
    });
  }
  
  if (isHammer(lastCandle)) {
    patterns.push({
      pattern: 'Hammer',
      signal: 'صاعد',
      confidence: 0.7,
      description: 'شمعة مطرقة تشير إلى احتمال انعكاس صعودي بعد هبوط'
    });
  }
  
  if (isInvertedHammer(lastCandle)) {
    patterns.push({
      pattern: 'InvertedHammer',
      signal: 'صاعد',
      confidence: 0.65,
      description: 'شمعة مطرقة مقلوبة قد تشير إلى انعكاس صعودي محتمل'
    });
  }
  
  if (isShootingStar(lastCandle)) {
    patterns.push({
      pattern: 'ShootingStar',
      signal: 'هابط',
      confidence: 0.7,
      description: 'نمط النجمة الساقطة يشير إلى احتمال انعكاس هبوطي بعد صعود'
    });
  }
  
  if (isDragonFlyDoji(lastCandle)) {
    patterns.push({
      pattern: 'DragonFlyDoji',
      signal: 'صاعد',
      confidence: 0.65,
      description: 'دوجي دراجون فلاي يشير غالبًا إلى انعكاس صعودي محتمل'
    });
  }
  
  if (isGravestoneDoji(lastCandle)) {
    patterns.push({
      pattern: 'GravestoneDoji',
      signal: 'هابط',
      confidence: 0.65,
      description: 'دوجي جريفستون يشير غالبًا إلى انعكاس هبوطي محتمل'
    });
  }
  
  if (isSpinningTop(lastCandle)) {
    patterns.push({
      pattern: 'SpinningTop',
      signal: 'محايد',
      confidence: 0.5,
      description: 'شمعة رأس المغزل تشير إلى التردد في السوق وعدم اليقين'
    });
  }
  
  if (isMarubozu(lastCandle)) {
    const signal = lastCandle.close > lastCandle.open ? 'صاعد' : 'هابط';
    patterns.push({
      pattern: 'Marubozu',
      signal,
      confidence: 0.75,
      description: `شمعة ماروبوزو ${signal === 'صاعد' ? 'صعودية' : 'هبوطية'} تشير إلى سيطرة قوية للمشترين${signal === 'صاعد' ? '' : '/البائعين'}`
    });
  }
  
  // أنماط الشمعتين
  if (isBullishEngulfing(lastTwoCandles)) {
    patterns.push({
      pattern: 'BullishEngulfing',
      signal: 'صاعد',
      confidence: 0.8,
      description: 'نمط ابتلاع صاعد قوي يشير إلى انعكاس السعر نحو الأعلى'
    });
  }
  
  if (isBearishEngulfing(lastTwoCandles)) {
    patterns.push({
      pattern: 'BearishEngulfing',
      signal: 'هابط',
      confidence: 0.8,
      description: 'نمط ابتلاع هابط قوي يشير إلى انعكاس السعر نحو الأسفل'
    });
  }
  
  if (isBullishHarami(lastTwoCandles)) {
    patterns.push({
      pattern: 'BullishHarami',
      signal: 'صاعد',
      confidence: 0.7,
      description: 'نمط حرامي صاعد يشير إلى انعكاس محتمل للاتجاه الهابط'
    });
  }
  
  if (isBearishHarami(lastTwoCandles)) {
    patterns.push({
      pattern: 'BearishHarami',
      signal: 'هابط',
      confidence: 0.7,
      description: 'نمط حرامي هابط يشير إلى انعكاس محتمل للاتجاه الصاعد'
    });
  }
  
  if (isPiercingLine(lastTwoCandles)) {
    patterns.push({
      pattern: 'PiercingLine',
      signal: 'صاعد',
      confidence: 0.75,
      description: 'نمط خط الاختراق يشير إلى انعكاس صعودي محتمل بعد اتجاه هابط'
    });
  }
  
  if (isDarkCloudCover(lastTwoCandles)) {
    patterns.push({
      pattern: 'DarkCloudCover',
      signal: 'هابط',
      confidence: 0.75,
      description: 'نمط السحابة الداكنة يشير إلى انعكاس هبوطي محتمل بعد اتجاه صاعد'
    });
  }
  
  // أنماط الثلاث شموع
  if (isEveningStar(lastThreeCandles)) {
    patterns.push({
      pattern: 'EveningStar',
      signal: 'هابط',
      confidence: 0.85,
      description: 'نمط نجمة المساء يشير إلى انعكاس هبوطي قوي بعد اتجاه صاعد'
    });
  }
  
  if (isMorningStar(lastThreeCandles)) {
    patterns.push({
      pattern: 'MorningStar',
      signal: 'صاعد',
      confidence: 0.85,
      description: 'نمط نجمة الصباح يشير إلى انعكاس صعودي قوي بعد اتجاه هابط'
    });
  }
  
  if (isThreeWhiteSoldiers(lastThreeCandles)) {
    patterns.push({
      pattern: 'ThreeWhiteSoldiers',
      signal: 'صاعد',
      confidence: 0.9,
      description: 'نمط ثلاثة جنود بيض يشير إلى استمرار قوي للاتجاه الصاعد'
    });
  }
  
  if (isThreeBlackCrows(lastThreeCandles)) {
    patterns.push({
      pattern: 'ThreeBlackCrows',
      signal: 'هابط',
      confidence: 0.9,
      description: 'نمط ثلاثة غربان سود يشير إلى استمرار قوي للاتجاه الهابط'
    });
  }
  
  return patterns;
};
