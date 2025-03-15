
/**
 * وحدة استخراج السعر من النص المباشر
 */

import { cleanPriceText } from './priceTextCleaner';
import { isReasonableGoldPrice } from './validators';

/**
 * استخراج السعر من النص المباشر
 */
export const extractPriceFromDirectText = (directText: string | null | undefined): number | null => {
  if (!directText) {
    return null;
  }
  
  console.log('النص المستخرج من العنصر مباشرة:', directText);
  
  // تنظيف النص من أي أحرف غير رقمية باستثناء النقطة العشرية أو الفاصلة
  const cleanText = cleanPriceText(directText);
  console.log('النص بعد التنظيف:', cleanText);
  
  const price = parseFloat(cleanText.replace(',', '.'));
  if (!isNaN(price) && price > 0) {
    // التحقق من معقولية السعر
    if (isReasonableGoldPrice(price)) {
      console.log('تم استخراج سعر ذهب معقول مباشرة من النص:', price);
      return price;
    } else {
      console.log('تم استخراج سعر خارج النطاق المتوقع للذهب:', price);
    }
  }
  
  return null;
};
