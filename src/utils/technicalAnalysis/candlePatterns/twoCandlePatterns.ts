
import { PriceData } from '../indicators/types';

// نمط الابتلاع الصاعد (Bullish Engulfing)
export const isBullishEngulfing = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2]; // الشمعة قبل الأخيرة
  const second = candles[candles.length - 1]; // الشمعة الأخيرة
  
  // الشمعة الأولى هبوطية والثانية صعودية
  const isFirstBearish = first.close < first.open;
  const isSecondBullish = second.close > second.open;
  
  // الشمعة الثانية تبتلع جسم الأولى
  const isEngulfing = second.open < first.close && 
                      second.close > first.open;
  
  return isFirstBearish && isSecondBullish && isEngulfing;
};

// نمط الابتلاع الهابط (Bearish Engulfing)
export const isBearishEngulfing = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2]; // الشمعة قبل الأخيرة
  const second = candles[candles.length - 1]; // الشمعة الأخيرة
  
  // الشمعة الأولى صعودية والثانية هبوطية
  const isFirstBullish = first.close > first.open;
  const isSecondBearish = second.close < second.open;
  
  // الشمعة الثانية تبتلع جسم الأولى
  const isEngulfing = second.open > first.close && 
                      second.close < first.open;
  
  return isFirstBullish && isSecondBearish && isEngulfing;
};

// نمط الحمل الصاعد (Bullish Harami)
export const isBullishHarami = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2]; // الشمعة قبل الأخيرة
  const second = candles[candles.length - 1]; // الشمعة الأخيرة
  
  // الشمعة الأولى هبوطية كبيرة والثانية صعودية صغيرة داخل الأولى
  const isFirstBearish = first.close < first.open;
  const isSecondBullish = second.close > second.open;
  
  // جسم الشمعة الثانية داخل جسم الأولى
  const isInside = second.open > first.close && 
                   second.close < first.open;
  
  return isFirstBearish && isSecondBullish && isInside;
};

// نمط الحمل الهابط (Bearish Harami)
export const isBearishHarami = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2]; // الشمعة قبل الأخيرة
  const second = candles[candles.length - 1]; // الشمعة الأخيرة
  
  // الشمعة الأولى صعودية كبيرة والثانية هبوطية صغيرة داخل الأولى
  const isFirstBullish = first.close > first.open;
  const isSecondBearish = second.close < second.open;
  
  // جسم الشمعة الثانية داخل جسم الأولى
  const isInside = second.open < first.close && 
                   second.close > first.open;
  
  return isFirstBullish && isSecondBearish && isInside;
};

// نمط الخط المخترق (Piercing Line)
export const isPiercingLine = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2]; // الشمعة قبل الأخيرة
  const second = candles[candles.length - 1]; // الشمعة الأخيرة
  
  // الشمعة الأولى هبوطية والثانية صعودية
  const isFirstBearish = first.close < first.open;
  const isSecondBullish = second.close > second.open;
  
  // فتح أقل من الإغلاق السابق وإغلاق يخترق أكثر من 50% من جسم الشمعة السابقة
  const isPiercing = second.open < first.close && 
                     second.close > first.open - (first.open - first.close) * 0.5 &&
                     second.close < first.open;
  
  return isFirstBearish && isSecondBullish && isPiercing;
};

// نمط السحابة السوداء (Dark Cloud Cover)
export const isDarkCloudCover = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2]; // الشمعة قبل الأخيرة
  const second = candles[candles.length - 1]; // الشمعة الأخيرة
  
  // الشمعة الأولى صعودية والثانية هبوطية
  const isFirstBullish = first.close > first.open;
  const isSecondBearish = second.close < second.open;
  
  // فتح أعلى من الإغلاق السابق وإغلاق يخترق أكثر من 50% من جسم الشمعة السابقة
  const isDarkCloud = second.open > first.close && 
                      second.close < first.close - (first.close - first.open) * 0.5 &&
                      second.close > first.open;
  
  return isFirstBullish && isSecondBearish && isDarkCloud;
};

// نمط بنسات التلاقي العلوية (Tweezer Top)
export const isTweezerTop = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2];
  const second = candles[candles.length - 1];
  
  // ارتفاع الشمعتين متماثل تقريبًا
  const similarHighs = Math.abs(first.high - second.high) < (first.high * 0.001);
  
  // الشمعة الأولى صعودية والثانية هبوطية
  const isFirstBullish = first.close > first.open;
  const isSecondBearish = second.close < second.open;
  
  return similarHighs && isFirstBullish && isSecondBearish;
};

// نمط بنسات التلاقي السفلية (Tweezer Bottom)
export const isTweezerBottom = (candles: PriceData[]): boolean => {
  if (candles.length < 2) return false;
  
  const first = candles[candles.length - 2];
  const second = candles[candles.length - 1];
  
  // انخفاض الشمعتين متماثل تقريبًا
  const similarLows = Math.abs(first.low - second.low) < (first.low * 0.001);
  
  // الشمعة الأولى هبوطية والثانية صعودية
  const isFirstBearish = first.close < first.open;
  const isSecondBullish = second.close > second.open;
  
  return similarLows && isFirstBearish && isSecondBullish;
};
