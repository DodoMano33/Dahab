
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
  
  // البحث عن نمط السعر في النص (رقم متبوع بنقطة وأرقام)
  const priceMatch = directText.match(/\b(1|2|3)\d{2,3}(\.\d{1,2})?\b/);
  if (priceMatch) {
    const extractedPriceText = priceMatch[0];
    console.log('تم العثور على نمط سعر في النص:', extractedPriceText);
    const price = parseFloat(extractedPriceText);
    
    if (!isNaN(price) && isReasonableGoldPrice(price)) {
      return price;
    }
  }
  
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
