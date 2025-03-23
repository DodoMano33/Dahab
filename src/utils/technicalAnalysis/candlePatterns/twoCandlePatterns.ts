
import { PriceData } from '../indicators';

// وظيفة للتحقق من نمط الابتلاع الصاعد
export const isBullishEngulfing = (candles: PriceData[]): boolean => {
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
export const isBearishEngulfing = (candles: PriceData[]): boolean => {
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
export const isBullishHarami = (candles: PriceData[]): boolean => {
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
export const isBearishHarami = (candles: PriceData[]): boolean => {
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
