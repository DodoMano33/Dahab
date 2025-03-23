
import { PriceData } from '../../indicators/types';
import { PatternResult } from '../types';
import { 
  isBullishEngulfing, isBearishEngulfing, isBullishHarami, isBearishHarami,
  isPiercingLine, isDarkCloudCover, isTweezerTop, isTweezerBottom
} from '../twoCandlePatterns';

/**
 * فحص أنماط الشمعتين
 * @param candles بيانات الشموع للتحليل
 * @returns مصفوفة من الأنماط المكتشفة
 */
export function detectTwoCandlePatterns(candles: PriceData[]): PatternResult[] {
  if (candles.length < 2) return [];
  
  const patterns: PatternResult[] = [];
  
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
  
  return patterns;
}
