
/**
 * وحدة بث تحديثات السعر
 */

import { getLastExtractedPrice, setLastExtractedPrice } from './state';
import { isReasonableGoldPrice } from './validators';

/**
 * نشر تحديث السعر في جميع أنحاء التطبيق
 */
export const broadcastPrice = (price: number) => {
  const lastPrice = getLastExtractedPrice();
  
  // تجنب البث المتكرر لنفس السعر، والتحقق من معقولية القيمة
  if (lastPrice === price) {
    return;
  }
  
  // التحقق من معقولية السعر للذهب
  if (!isReasonableGoldPrice(price)) {
    console.warn('تم استبعاد قيمة سعر غير معقولة:', price);
    return;
  }
  
  setLastExtractedPrice(price);
  
  // إرسال حدث تحديث السعر
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price,
      symbol: 'CFI:XAUUSD',
      timestamp: Date.now()
    }
  }));
  
  console.log('تم نشر تحديث السعر:', price);
};
