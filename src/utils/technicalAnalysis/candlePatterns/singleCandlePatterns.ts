
import { PriceData } from '../indicators/types';

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

// نمط شمعة النجمة الساقطة
export const isShootingStar = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  // حساب الظلال العلوية والسفلية
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // النجمة الساقطة لها ظل علوي طويل جدًا وجسم صغير والظل السفلي قصير جدًا أو غير موجود
  return (
    candle.close < candle.open && // شمعة هابطة
    bodySize / totalRange < 0.3 && // جسم صغير
    upperShadow / totalRange > 0.6 && // ظل علوي طويل جدًا
    lowerShadow / totalRange < 0.05 // ظل سفلي قصير جدًا أو غير موجود
  );
};

// نمط شمعة الدوجي دراجون فلاي (شمعة على شكل T)
export const isDragonFlyDoji = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  // حساب الظلال العلوية والسفلية
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // دراجون فلاي دوجي لها جسم صغير جدًا في الأعلى وظل سفلي طويل وبدون ظل علوي تقريبًا
  return (
    bodySize / totalRange < 0.05 && // جسم صغير جدًا
    upperShadow / totalRange < 0.05 && // بدون ظل علوي تقريبًا
    lowerShadow / totalRange > 0.7 // ظل سفلي طويل جدًا
  );
};

// نمط شمعة الدوجي جريفستون (شمعة على شكل مقلوب T)
export const isGravestoneDoji = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  // حساب الظلال العلوية والسفلية
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // جريفستون دوجي لها جسم صغير جدًا في الأسفل وظل علوي طويل وبدون ظل سفلي تقريبًا
  return (
    bodySize / totalRange < 0.05 && // جسم صغير جدًا
    upperShadow / totalRange > 0.7 && // ظل علوي طويل جدًا
    lowerShadow / totalRange < 0.05 // بدون ظل سفلي تقريبًا
  );
};

// نمط شمعة سبيننج توب (راس المغزل)
export const isSpinningTop = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  // حساب الظلال العلوية والسفلية
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // سبيننج توب لها جسم صغير في المنتصف وظلال متساوية تقريبًا علوية وسفلية
  return (
    bodySize / totalRange < 0.3 && // جسم صغير
    upperShadow / totalRange > 0.25 && // ظل علوي كبير
    lowerShadow / totalRange > 0.25 && // ظل سفلي كبير
    Math.abs(upperShadow - lowerShadow) / totalRange < 0.1 // الظلال متساوية تقريبًا
  );
};

// نمط شمعة ماروبوزو (الشمعة ذات الجسم الكامل)
export const isMarubozu = (candle: PriceData): boolean => {
  const bodySize = Math.abs(candle.close - candle.open);
  const totalRange = candle.high - candle.low;
  
  // حساب الظلال العلوية والسفلية
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // ماروبوزو لها جسم كبير جدًا وبدون ظلال أو ظلال صغيرة جدًا
  return (
    bodySize / totalRange > 0.8 && // جسم كبير جدًا
    upperShadow / totalRange < 0.1 && // ظل علوي صغير جدًا أو غير موجود
    lowerShadow / totalRange < 0.1 // ظل سفلي صغير جدًا أو غير موجود
  );
};
