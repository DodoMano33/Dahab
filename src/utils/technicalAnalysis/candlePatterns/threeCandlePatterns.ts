
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

// نمط الطفل المهجور (Abandoned Baby)
export const isAbandonedBaby = (candles: PriceData[]): boolean => {
  if (candles.length < 3) return false;
  
  const first = candles[candles.length - 3];
  const middle = candles[candles.length - 2];
  const last = candles[candles.length - 1];
  
  // الشمعة الوسطى يجب أن تكون دوجي
  const isDoji = Math.abs(middle.close - middle.open) < ((middle.high - middle.low) * 0.05);
  
  if (!isDoji) return false;
  
  // نمط الطفل المهجور الصاعد
  const isBullishAbandonedBaby = 
    first.close < first.open && // الشمعة الأولى هبوطية
    middle.high < first.low && // فجوة هبوطية كاملة بين الأولى والوسطى
    last.close > last.open && // الشمعة الأخيرة صعودية
    last.low > middle.high; // فجوة صعودية كاملة بين الوسطى والأخيرة
    
  // نمط الطفل المهجور الهابط
  const isBearishAbandonedBaby = 
    first.close > first.open && // الشمعة الأولى صعودية
    middle.low > first.high && // فجوة صعودية كاملة بين الأولى والوسطى
    last.close < last.open && // الشمعة الأخيرة هبوطية
    last.high < middle.low; // فجوة هبوطية كاملة بين الوسطى والأخيرة
    
  return isBullishAbandonedBaby || isBearishAbandonedBaby;
};

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
