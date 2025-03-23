
import { PriceDirection } from '../types';

// تنسيق الرقم لعرض 2 أرقام عشرية
export const formatPrice = (price: number | null): string => {
  if (price === null) return "-";
  return price.toFixed(2);
};

// دالة لتحديد لون خلفية السعر الحالي بناء على اتجاه السعر
export const getPriceBackgroundColor = (priceDirection: PriceDirection): string => {
  if (priceDirection === 'up') {
    return 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-700';
  } else if (priceDirection === 'down') {
    return 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-700';
  }
  return 'bg-slate-200 dark:bg-slate-700';
};
