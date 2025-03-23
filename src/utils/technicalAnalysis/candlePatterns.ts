
import { PriceData } from './indicators';

// أنواع أنماط الشموع المدعومة
export type CandlePatternType = 
  | 'Doji' 
  | 'Hammer' 
  | 'InvertedHammer' 
  | 'BullishEngulfing' 
  | 'BearishEngulfing'
  | 'BullishHarami'
  | 'BearishHarami'
  | 'EveningStar'
  | 'MorningStar'
  | 'ShootingStar'
  | 'ThreeWhiteSoldiers'
  | 'ThreeBlackCrows';

export type PatternResult = {
  pattern: CandlePatternType;
  signal: 'صاعد' | 'هابط' | 'محايد';
  confidence: number; // نسبة الثقة (0-1)
  description: string;
};

// وظيفة للتحقق مما إذا كانت الشمعة دوجي
const isDoji = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  return bodySize / totalRange < 0.1; // جسم صغير جدًا مقارنة بالنطاق الكلي
};

// وظيفة للتحقق مما إذا كانت الشمعة مطرقة
const isHammer = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  // حساب الظلال العلوية والسفلية
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // المطرقة لها ظل سفلي طويل والجسم في الأعلى مع ظل علوي قصير
  return (
    bodySize / totalRange < 0.3 && // جسم صغير نسبيًا
    upperShadow / totalRange < 0.1 && // ظل علوي قصير
    lowerShadow / totalRange > 0.6 // ظل سفلي طويل
  );
};

// وظيفة للتحقق مما إذا كانت الشمعة مطرقة مقلوبة
const isInvertedHammer = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  // حساب الظلال العلوية والسفلية
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // المطرقة المقلوبة لها ظل علوي طويل والجسم في الأسفل مع ظل سفلي قصير
  return (
    bodySize / totalRange < 0.3 && // جسم صغير نسبيًا
    upperShadow / totalRange > 0.6 && // ظل علوي طويل
    lowerShadow / totalRange < 0.1 // ظل سفلي قصير
  );
};

// وظيفة للتحقق من نمط الابتلاع الصاعد
const isBullishEngulfing = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const current = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  
  // شرط الابتلاع الصاعد: الشمعة السابقة حمراء، والحالية خضراء أكبر
  return (
    previous.close < previous.open && // الشمعة السابقة هبوطية
    current.close > current.open && // الشمعة الحالية صعودية
    current.open < previous.close && // فتح الشمعة الحالية أقل من إغلاق السابقة
    current.close > previous.open // إغلاق الشمعة الحالية أكبر من فتح السابقة
  );
};

// وظيفة للتحقق من نمط الابتلاع الهابط
const isBearishEngulfing = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const current = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  
  // شرط الابتلاع الهابط: الشمعة السابقة خضراء، والحالية حمراء أكبر
  return (
    previous.close > previous.open && // الشمعة السابقة صعودية
    current.close < current.open && // الشمعة الحالية هبوطية
    current.open > previous.close && // فتح الشمعة الحالية أكبر من إغلاق السابقة
    current.close < previous.open // إغلاق الشمعة الحالية أقل من فتح السابقة
  );
};

// وظيفة للتحقق من نمط الحرامي الصاعد
const isBullishHarami = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const current = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  
  const currentBodySize = Math.abs(current.close - current.open);
  const previousBodySize = Math.abs(previous.close - previous.open);
  
  // شرط الحرامي الصاعد: الشمعة السابقة كبيرة هبوطية، والحالية صغيرة صعودية داخلها
  return (
    previous.close < previous.open && // الشمعة السابقة هبوطية
    current.close > current.open && // الشمعة الحالية صعودية
    currentBodySize < previousBodySize * 0.6 && // جسم الشمعة الحالية أصغر
    current.high < previous.open && // سقف الشمعة الحالية أقل من فتح السابقة
    current.low > previous.close // قاع الشمعة الحالية أكبر من إغلاق السابقة
  );
};

// وظيفة للتحقق من نمط الحرامي الهابط
const isBearishHarami = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const current = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  
  const currentBodySize = Math.abs(current.close - current.open);
  const previousBodySize = Math.abs(previous.close - previous.open);
  
  // شرط الحرامي الهابط: الشمعة السابقة كبيرة صعودية، والحالية صغيرة هبوطية داخلها
  return (
    previous.close > previous.open && // الشمعة السابقة صعودية
    current.close < current.open && // الشمعة الحالية هبوطية
    currentBodySize < previousBodySize * 0.6 && // جسم الشمعة الحالية أصغر
    current.high < previous.high && // سقف الشمعة الحالية أقل من سقف السابقة
    current.low > previous.low // قاع الشمعة الحالية أكبر من قاع السابقة
  );
};

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

// وظيفة مساعدة لتحويل مصفوفة أسعار الإغلاق إلى كائنات PriceData
export const convertToPriceData = (
  timestamps: number[],
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume?: number[]
): PriceData[] => {
  return timestamps.map((timestamp, i) => ({
    timestamp,
    open: open[i],
    high: high[i],
    low: low[i],
    close: close[i],
    volume: volume ? volume[i] : undefined
  }));
};
