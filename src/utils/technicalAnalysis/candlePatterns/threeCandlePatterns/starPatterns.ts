
import { PriceData } from '../../indicators/types';

// نمط نجمة المساء (Evening Star)
export const isEveningStar = (candles: PriceData[]): boolean => {
  if (candles.length < 3) return false;
  
  const first = candles[candles.length - 3]; // الشمعة الأولى
  const middle = candles[candles.length - 2]; // الشمعة الوسطى
  const last = candles[candles.length - 1]; // الشمعة الأخيرة
  
  const firstBodySize = Math.abs(first.close - first.open);
  const middleBodySize = Math.abs(middle.close - middle.open);
  const lastBodySize = Math.abs(last.close - last.open);
  
  // شرط نجمة المساء: الشمعة الأولى صعودية كبيرة، والوسطى صغيرة (دوجي غالبًا)، والأخيرة هبوطية كبيرة
  return (
    first.close > first.open && // الشمعة الأولى صعودية
    firstBodySize > middleBodySize * 2 && // جسم الشمعة الأولى أكبر من جسم الوسطى
    middleBodySize < (first.high - first.low) * 0.1 && // الشمعة الوسطى صغيرة
    middle.low > first.close && // فجوة صعودية بين الأولى والوسطى
    last.close < last.open && // الشمعة الأخيرة هبوطية
    last.open < middle.open && // فتح الشمعة الأخيرة أقل من فتح الوسطى
    last.close < first.close // إغلاق الشمعة الأخيرة أقل من إغلاق الأولى
  );
};

// نمط نجمة الصباح (Morning Star)
export const isMorningStar = (candles: PriceData[]): boolean => {
  if (candles.length < 3) return false;
  
  const first = candles[candles.length - 3]; // الشمعة الأولى
  const middle = candles[candles.length - 2]; // الشمعة الوسطى
  const last = candles[candles.length - 1]; // الشمعة الأخيرة
  
  const firstBodySize = Math.abs(first.close - first.open);
  const middleBodySize = Math.abs(middle.close - middle.open);
  const lastBodySize = Math.abs(last.close - last.open);
  
  // شرط نجمة الصباح: الشمعة الأولى هبوطية كبيرة، والوسطى صغيرة (دوجي غالبًا)، والأخيرة صعودية كبيرة
  return (
    first.close < first.open && // الشمعة الأولى هبوطية
    firstBodySize > middleBodySize * 2 && // جسم الشمعة الأولى أكبر من جسم الوسطى
    middleBodySize < (first.high - first.low) * 0.1 && // الشمعة الوسطى صغيرة
    middle.high < first.close && // فجوة هبوطية بين الأولى والوسطى
    last.close > last.open && // الشمعة الأخيرة صعودية
    last.open > middle.open && // فتح الشمعة الأخيرة أعلى من فتح الوسطى
    last.close > first.close // إغلاق الشمعة الأخيرة أعلى من إغلاق الأولى
  );
};

// نمط نجمة الصباح الدوجي (Morning Doji Star)
export const isMorningDojiStar = (candles: PriceData[]): boolean => {
  if (candles.length < 3) return false;
  
  const first = candles[candles.length - 3];
  const middle = candles[candles.length - 2];
  const last = candles[candles.length - 1];
  
  // الشمعة الوسطى يجب أن تكون دوجي
  const isDoji = Math.abs(middle.close - middle.open) < ((middle.high - middle.low) * 0.05);
  
  // باقي الشروط مثل نجمة الصباح العادية
  if (!isDoji) return false;
  
  return isMorningStar(candles);
};

// نمط نجمة المساء الدوجي (Evening Doji Star)
export const isEveningDojiStar = (candles: PriceData[]): boolean => {
  if (candles.length < 3) return false;
  
  const first = candles[candles.length - 3];
  const middle = candles[candles.length - 2];
  const last = candles[candles.length - 1];
  
  // الشمعة الوسطى يجب أن تكون دوجي
  const isDoji = Math.abs(middle.close - middle.open) < ((middle.high - middle.low) * 0.05);
  
  // باقي الشروط مثل نجمة المساء العادية
  if (!isDoji) return false;
  
  return isEveningStar(candles);
};
