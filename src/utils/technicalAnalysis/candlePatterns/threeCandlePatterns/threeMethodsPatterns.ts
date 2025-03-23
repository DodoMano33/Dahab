
import { PriceData } from '../../indicators/types';

// نمط الثلاثة طرق الصاعدة (Rising Three Methods)
export const isRisingThreeMethods = (candles: PriceData[]): boolean => {
  if (candles.length < 5) return false;
  
  const first = candles[candles.length - 5]; // الشمعة الكبيرة الأولى
  const second = candles[candles.length - 4]; // أول شمعة صغيرة
  const third = candles[candles.length - 3]; // ثاني شمعة صغيرة
  const fourth = candles[candles.length - 2]; // ثالث شمعة صغيرة
  const fifth = candles[candles.length - 1]; // الشمعة الكبيرة الأخيرة
  
  // الشمعة الأولى والأخيرة صعودية كبيرة
  const isFirstBullish = first.close > first.open;
  const isLastBullish = fifth.close > fifth.open;
  
  if (!isFirstBullish || !isLastBullish) return false;
  
  // الشموع الثلاث الوسطى تتحرك للأسفل ولكنها لا تتجاوز جسم الشمعة الأولى
  const insideBodyRange = 
    second.low > first.open && 
    third.low > first.open && 
    fourth.low > first.open;
    
  // الشمعة الأخيرة تغلق أعلى من إغلاق الشمعة الأولى
  const lastCloseHigher = fifth.close > first.close;
  
  return insideBodyRange && lastCloseHigher;
};

// نمط الثلاثة طرق الهابطة (Falling Three Methods)
export const isFallingThreeMethods = (candles: PriceData[]): boolean => {
  if (candles.length < 5) return false;
  
  const first = candles[candles.length - 5]; // الشمعة الكبيرة الأولى
  const second = candles[candles.length - 4]; // أول شمعة صغيرة
  const third = candles[candles.length - 3]; // ثاني شمعة صغيرة
  const fourth = candles[candles.length - 2]; // ثالث شمعة صغيرة
  const fifth = candles[candles.length - 1]; // الشمعة الكبيرة الأخيرة
  
  // الشمعة الأولى والأخيرة هبوطية كبيرة
  const isFirstBearish = first.close < first.open;
  const isLastBearish = fifth.close < fifth.open;
  
  if (!isFirstBearish || !isLastBearish) return false;
  
  // الشموع الثلاث الوسطى تتحرك للأعلى ولكنها لا تتجاوز جسم الشمعة الأولى
  const insideBodyRange = 
    second.high < first.open && 
    third.high < first.open && 
    fourth.high < first.open;
    
  // الشمعة الأخيرة تغلق أقل من إغلاق الشمعة الأولى
  const lastCloseLower = fifth.close < first.close;
  
  return insideBodyRange && lastCloseLower;
};
