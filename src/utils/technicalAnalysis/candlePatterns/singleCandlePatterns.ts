
import { PriceData } from '../indicators/types';

// دالة حساب طول جسم الشمعة
const getBodySize = (candle: PriceData): number => {
  return Math.abs(candle.close - candle.open);
};

// دالة حساب طول الظل العلوي
const getUpperShadow = (candle: PriceData): number => {
  return candle.close > candle.open 
    ? candle.high - candle.close 
    : candle.high - candle.open;
};

// دالة حساب طول الظل السفلي
const getLowerShadow = (candle: PriceData): number => {
  return candle.close > candle.open 
    ? candle.open - candle.low 
    : candle.close - candle.low;
};

// دالة حساب طول كامل الشمعة
const getCandleSize = (candle: PriceData): number => {
  return candle.high - candle.low;
};

// دوجي - شمعة بدون جسم تقريبًا
export const isDoji = (candle: PriceData): boolean => {
  const bodySize = getBodySize(candle);
  const candleSize = getCandleSize(candle);
  
  // إذا كان حجم الجسم أقل من 5% من حجم الشمعة الكاملة
  return bodySize <= candleSize * 0.05;
};

// دوجي طائر التنين - دوجي مع ظل سفلي طويل وبدون ظل علوي تقريبًا
export const isDragonFlyDoji = (candle: PriceData): boolean => {
  if (!isDoji(candle)) return false;
  
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  const candleSize = getCandleSize(candle);
  
  return upperShadow <= candleSize * 0.05 && lowerShadow >= candleSize * 0.6;
};

// دوجي شاهدة القبر - دوجي مع ظل علوي طويل وبدون ظل سفلي تقريبًا
export const isGravestoneDoji = (candle: PriceData): boolean => {
  if (!isDoji(candle)) return false;
  
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  const candleSize = getCandleSize(candle);
  
  return lowerShadow <= candleSize * 0.05 && upperShadow >= candleSize * 0.6;
};

// نمط المطرقة - جسم صغير في الأعلى وظل سفلي طويل
export const isHammer = (candle: PriceData): boolean => {
  const bodySize = getBodySize(candle);
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  const candleSize = getCandleSize(candle);
  
  // جسم صغير (أقل من 25% من الشمعة)، ظل سفلي طويل (أكثر من ضعف الجسم)، ظل علوي قصير
  return bodySize <= candleSize * 0.25 && 
         lowerShadow >= bodySize * 2 && 
         upperShadow <= bodySize * 0.5;
};

// نمط المطرقة المقلوبة - جسم صغير في الأسفل وظل علوي طويل
export const isInvertedHammer = (candle: PriceData): boolean => {
  const bodySize = getBodySize(candle);
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  const candleSize = getCandleSize(candle);
  
  // جسم صغير (أقل من 25% من الشمعة)، ظل علوي طويل (أكثر من ضعف الجسم)، ظل سفلي قصير
  return bodySize <= candleSize * 0.25 && 
         upperShadow >= bodySize * 2 && 
         lowerShadow <= bodySize * 0.5;
};

// نمط النجمة الهابطة - مشابه للمطرقة المقلوبة ولكن في أعلى الاتجاه
export const isShootingStar = (candle: PriceData, prevCandles: PriceData[]): boolean => {
  if (!isInvertedHammer(candle)) return false;
  
  // نحتاج إلى شمعة سابقة على الأقل للتأكد من أننا في اتجاه صاعد
  if (prevCandles.length < 1) return false;
  
  const prevCandle = prevCandles[prevCandles.length - 1];
  
  // يجب أن تكون في اتجاه صاعد وتفتح أعلى من إغلاق الشمعة السابقة
  return prevCandle.close < candle.open && prevCandle.close < prevCandle.open;
};

// نمط الرجل المشنوق - شمعة مطرقة في أعلى الاتجاه
export const isHangingMan = (candle: PriceData, prevCandles: PriceData[]): boolean => {
  if (!isHammer(candle)) return false;
  
  // نحتاج إلى شمعتين سابقتين على الأقل للتأكد من أننا في اتجاه صاعد
  if (prevCandles.length < 2) return false;
  
  // نتحقق من وجود اتجاه صاعد قبل الرجل المشنوق
  const isUptrend = prevCandles[prevCandles.length - 1].close > prevCandles[prevCandles.length - 2].close &&
                   prevCandles[prevCandles.length - 2].close > prevCandles[prevCandles.length - 3]?.close;
  
  return isUptrend;
};

// نمط القمة المستديرة - جسم صغير مع ظلال متساوية تقريبًا
export const isSpinningTop = (candle: PriceData): boolean => {
  const bodySize = getBodySize(candle);
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  const candleSize = getCandleSize(candle);
  
  // جسم صغير (أقل من 30% من الشمعة) وظلال متوازنة نسبيًا
  return bodySize <= candleSize * 0.3 && 
         upperShadow > bodySize * 0.5 && 
         lowerShadow > bodySize * 0.5 && 
         Math.abs(upperShadow - lowerShadow) < candleSize * 0.2;
};

// مارابوزو - شمعة ذات جسم كبير وبدون ظلال تقريبًا
export const isMarubozu = (candle: PriceData): boolean => {
  const bodySize = getBodySize(candle);
  const upperShadow = getUpperShadow(candle);
  const lowerShadow = getLowerShadow(candle);
  const candleSize = getCandleSize(candle);
  
  // جسم كبير (أكثر من 90% من الشمعة)
  return bodySize >= candleSize * 0.9 && 
         upperShadow <= candleSize * 0.05 && 
         lowerShadow <= candleSize * 0.05;
};
