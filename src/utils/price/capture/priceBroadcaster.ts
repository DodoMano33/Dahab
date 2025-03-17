
/**
 * وحدة بث تحديثات السعر
 */

import { getLastExtractedPrice, setLastExtractedPrice } from './state';

/**
 * نشر تحديث السعر في جميع أنحاء التطبيق
 */
export const broadcastPrice = (price: number, force: boolean = false, source: string = 'CFI:XAUUSD') => {
  const lastPrice = getLastExtractedPrice();
  
  // تجنب البث المتكرر لنفس السعر، إلا مع تمكين force
  if (lastPrice === price && !force) {
    return;
  }
  
  // التحقق من معقولية السعر للذهب (أي سعر موجب معقول)
  if (isNaN(price) || price <= 0) {
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
  
  // إرسال حدث إضافي لضمان وصول السعر لجميع المكونات
  window.dispatchEvent(new CustomEvent('price-updated', {
    detail: {
      price,
      symbol: source,
      timestamp: Date.now(),
      source: 'broadcaster'
    }
  }));
  
  // تحديث مباشر لعناصر السعر في واجهة المستخدم
  const priceDisplayElements = document.querySelectorAll(
    '#stats-price-display, #tradingview-price-display, .price-display'
  );
  
  priceDisplayElements.forEach(element => {
    if (element.tagName === 'INPUT') {
      (element as HTMLInputElement).value = price.toFixed(2);
    } else {
      element.textContent = price.toFixed(2);
    }
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
  const priceSelectors = [
    '.tv-symbol-price-quote__value', 
    '.tv-symbol-header__first-line', 
    '.js-symbol-last'
  ];
  
  for (const selector of priceSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent?.trim();
      if (text && /\d+,\d+\.\d+|\d+\.\d+/.test(text)) {
        const matches = text.match(/\b\d+,\d+\.\d+\b|\b\d+\.\d+\b/);
        if (matches && matches[0]) {
          const price = parseFloat(matches[0].replace(/,/g, ''));
          if (!isNaN(price) && price > 0) {
            console.log(`تم العثور على سعر مباشر من العناصر: ${price}`);
            broadcastPrice(price, true, source);
            return true;
          }
        }
      }
    }
  }
  
  // طلب تحديث من أي مصدر متاح
  window.dispatchEvent(new Event('request-extracted-price'));
  
  return false;
};
