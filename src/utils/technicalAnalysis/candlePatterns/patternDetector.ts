
import { PriceData } from '../indicators';
import { PatternResult } from './types';
import { isDoji, isHammer, isInvertedHammer } from './singleCandlePatterns';
import { 
  isBullishEngulfing, isBearishEngulfing, 
  isBullishHarami, isBearishHarami 
} from './twoCandlePatterns';

// الوظيفة الرئيسية للكشف عن أنماط الشموع
export const detectCandlePatterns = (data: PriceData[]): PatternResult[] => {
  if (data.length < 3) {
    return [];
  }
  
  const patterns: PatternResult[] = [];
  const lastCandle = data[data.length - 1];
  const lastTwoCandles = data.slice(-2);
  
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
  
  // إضافة المزيد من الأنماط حسب الحاجة
  
  return patterns;
};
