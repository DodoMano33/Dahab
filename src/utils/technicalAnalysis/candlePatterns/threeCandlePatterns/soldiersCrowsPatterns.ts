
import { PriceData } from '../../indicators/types';

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
