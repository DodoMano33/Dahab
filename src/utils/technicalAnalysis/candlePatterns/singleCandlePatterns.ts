
import { PriceData } from '../indicators';

// وظيفة للتحقق مما إذا كانت الشمعة دوجي
export const isDoji = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  return bodySize / totalRange < 0.1; // جسم صغير جدًا مقارنة بالنطاق الكلي
};

// وظيفة للتحقق مما إذا كانت الشمعة مطرقة
export const isHammer = (candle: PriceData): boolean => {
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
export const isInvertedHammer = (candle: PriceData): boolean => {
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
