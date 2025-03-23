
import { PriceData } from '../../indicators/types';

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
