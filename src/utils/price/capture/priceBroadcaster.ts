
/**
 * وحدة بث تحديثات السعر
 */

import { getLastExtractedPrice, setLastExtractedPrice } from './state';
import { isReasonableGoldPrice } from './validators';

/**
 * نشر تحديث السعر في جميع أنحاء التطبيق
 */
export const broadcastPrice = (price: number, force: boolean = false, source: string = 'CFI:XAUUSD') => {
  const lastPrice = getLastExtractedPrice();
  
  // تجنب البث المتكرر لنفس السعر، والتحقق من معقولية القيمة
  if (lastPrice === price && !force) {
    return;
  }
  
  // التحقق من معقولية السعر للذهب
  if (!isReasonableGoldPrice(price)) {
    console.warn('تم استبعاد قيمة سعر غير معقولة:', price);
    return;
  }
  
  console.log(`تم تحديث السعر: ${price}`);
  
  // تحديث آخر سعر تم استخراجه
  setLastExtractedPrice(price);
  
  // إرسال الحدث الرئيسي لتحديث السعر عبر التطبيق
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price,
      symbol: source,
      timestamp: Date.now(),
      source: 'tradingview',
      provider: 'CFI'
    }
  }));

  // إرسال أحداث إضافية لضمان التحديث في جميع أجزاء التطبيق
  window.dispatchEvent(new CustomEvent('current-price-response', { 
    detail: { 
      price,
      symbol: source,
      timestamp: Date.now(),
      dayLow: price * 0.997,
      dayHigh: price * 1.003,
      weekLow: price * 0.95,
      weekHigh: price * 1.05,
      change: -3.785,
      changePercent: -0.13,
      recommendation: "Strong buy"
    }
  }));
  
  // إرسال حدث آخر للتحديث في عناصر أخرى مثل جدول التحليلات
  window.dispatchEvent(new CustomEvent('chart-price-update', {
    detail: {
      price,
      symbol: source,
      timestamp: Date.now()
    }
  }));
  
  // تحديث مباشر لعناصر السعر في واجهة المستخدم
  const priceDisplayElements = document.querySelectorAll('#stats-price-display');
  priceDisplayElements.forEach(element => {
    element.textContent = price.toFixed(2);
  });
  
  console.log(`تم نشر تحديث السعر في كامل التطبيق (${source}): ${price}`);
};

/**
 * طلب الحصول على تحديث فوري للسعر
 */
export const requestPriceUpdate = (source: string = 'CFI:XAUUSD') => {
  const lastPrice = getLastExtractedPrice();
  
  // البث بشكل فوري إذا كان لدينا سعر محفوظ
  if (lastPrice !== null) {
    broadcastPrice(lastPrice, true, source);
    return true;
  }
  
  // محاولة استخراج السعر مباشرة من عناصر الصفحة
  const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
  for (const element of priceElements) {
    const text = element.textContent?.trim();
    if (text) {
      const price = parseFloat(text.replace(/,/g, ''));
      if (!isNaN(price) && price >= 1800 && price <= 3500) {
        console.log(`تم العثور على سعر مباشر من العناصر: ${price}`);
        broadcastPrice(price, true, source);
        return true;
      }
    }
  }
  
  return false;
};
