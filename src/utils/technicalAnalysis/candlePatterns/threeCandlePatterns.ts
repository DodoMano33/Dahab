
import { PriceData } from '../indicators/types';

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

// نمط ثلاثة جنود بيض (Three White Soldiers)
export const isThreeWhiteSoldiers = (candles: PriceData[]): boolean => {
  if (candles.length < 3) return false;
  
  const first = candles[candles.length - 3]; // الجندي الأول
  const second = candles[candles.length - 2]; // الجندي الثاني
  const third = candles[candles.length - 1]; // الجندي الثالث
  
  // شرط ثلاثة جنود بيض: ثلاث شموع صعودية متتالية، كل شمعة تفتح داخل جسم السابقة وتغلق أعلى من إغلاق السابقة
  return (
    first.close > first.open && // الشمعة الأولى صعودية
    second.close > second.open && // الشمعة الثانية صعودية
    third.close > third.open && // الشمعة الثالثة صعودية
    second.open > first.open && // فتح الثانية أعلى من فتح الأولى
    third.open > second.open && // فتح الثالثة أعلى من فتح الثانية
    second.close > first.close && // إغلاق الثانية أعلى من إغلاق الأولى
    third.close > second.close && // إغلاق الثالثة أعلى من إغلاق الثانية
    second.open < second.close * 0.97 && // الشمعة الثانية تفتح في النصف العلوي من الشمعة الأولى
    third.open < third.close * 0.97 // الشمعة الثالثة تفتح في النصف العلوي من الشمعة الثانية
  );
};

// نمط ثلاثة غربان سود (Three Black Crows)
export const isThreeBlackCrows = (candles: PriceData[]): boolean => {
  if (candles.length < 3) return false;
  
  const first = candles[candles.length - 3]; // الغراب الأول
  const second = candles[candles.length - 2]; // الغراب الثاني
  const third = candles[candles.length - 1]; // الغراب الثالث
  
  // شرط ثلاثة غربان سود: ثلاث شموع هبوطية متتالية، كل شمعة تفتح داخل جسم السابقة وتغلق أقل من إغلاق السابقة
  return (
    first.close < first.open && // الشمعة الأولى هبوطية
    second.close < second.open && // الشمعة الثانية هبوطية
    third.close < third.open && // الشمعة الثالثة هبوطية
    second.open < first.open && // فتح الثانية أقل من فتح الأولى
    third.open < second.open && // فتح الثالثة أقل من فتح الثانية
    second.close < first.close && // إغلاق الثانية أقل من إغلاق الأولى
    third.close < second.close && // إغلاق الثالثة أقل من إغلاق الثانية
    second.open > second.close * 1.03 && // الشمعة الثانية تفتح في النصف السفلي من الشمعة الأولى
    third.open > third.close * 1.03 // الشمعة الثالثة تفتح في النصف السفلي من الشمعة الثانية
  );
};
