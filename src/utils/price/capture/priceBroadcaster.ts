
/**
 * وحدة بث تحديثات السعر
 */

import { getLastExtractedPrice, setLastExtractedPrice } from './state';
import { isReasonableGoldPrice } from './validators';

/**
 * نشر تحديث السعر في جميع أنحاء التطبيق
 */
export const broadcastPrice = (price: number, force: boolean = false) => {
  const lastPrice = getLastExtractedPrice();
  
  // تجنب البث المتكرر لنفس السعر، والتحقق من معقولية القيمة
  if (lastPrice === price && !force) {
    console.log('لم يتغير السعر منذ آخر بث:', price);
    return;
  }
  
  // التحقق من معقولية السعر للذهب
  if (!isReasonableGoldPrice(price)) {
    console.warn('تم استبعاد قيمة سعر غير معقولة:', price);
    return;
  }
  
  // حساب نسبة التغيير في السعر
  const changeThreshold = 0.0001; // 0.01%
  
  // تحديد ما إذا كان السعر تغير بما فيه الكفاية للبث
  const isSignificantChange = lastPrice === null || force || 
    Math.abs((price - lastPrice) / lastPrice) > changeThreshold;
  
  if (!isSignificantChange) {
    console.log(`لم يتغير السعر بشكل كافٍ للبث: ${price} آخر سعر: ${lastPrice}`);
    return;
  }
  
  // تحديث آخر سعر تم استخراجه
  setLastExtractedPrice(price);
  
  // إرسال حدث تحديث السعر
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price,
      symbol: 'CFI:XAUUSD',
      timestamp: Date.now(),
      source: 'extracted'
    }
  }));
  
  console.log('تم نشر تحديث السعر:', price);
};

/**
 * طلب الحصول على تحديث فوري للسعر
 */
export const requestPriceUpdate = () => {
  const lastPrice = getLastExtractedPrice();
  
  // البث بشكل فوري إذا كان لدينا سعر محفوظ
  if (lastPrice !== null) {
    console.log('إرسال تحديث فوري للسعر المحفوظ:', lastPrice);
    broadcastPrice(lastPrice, true);
    return true;
  }
  
  console.log('لا يوجد سعر محفوظ للإرسال الفوري');
  return false;
};
