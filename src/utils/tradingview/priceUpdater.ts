
/**
 * Utility functions for handling price updates from TradingView
 */
import { 
  startPriceCapture, 
  stopPriceCapture, 
  cleanupPriceCapture,
  requestImmediatePriceUpdate 
} from '@/utils/price/screenshotPriceExtractor';

export const requestInitialPrice = () => {
  try {
    // محاولة استخراج السعر مباشرة من العنصر المخصص
    const tradingViewPriceElement = document.querySelector('.tv-symbol-price-quote__value.js-symbol-last');
    if (tradingViewPriceElement) {
      const priceText = tradingViewPriceElement.textContent?.trim();
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم العثور على سعر في عنصر TradingView المخصص: ${price}`);
          
          // إرسال حدث مع السعر المستخرج
          window.dispatchEvent(new CustomEvent('tradingview-price-update', {
            detail: {
              price,
              symbol: 'CFI:XAUUSD',
              timestamp: Date.now(),
              provider: 'CFI',
              source: 'extracted'
            }
          }));
          
          return;
        }
      }
    }
    
    // طلب تحديث فوري من نظام استخراج السعر
    requestImmediatePriceUpdate();
    
    // إرسال طلب السعر الحالي
    window.dispatchEvent(new Event('request-current-price'));
    
    // طلب السعر المستخرج بشكل صريح
    window.dispatchEvent(new Event('request-extracted-price'));
    
    console.log('تم إرسال طلب الحصول على السعر الحالي من CFI بجميع الطرق المتاحة');
  } catch (e) {
    console.warn('فشل في طلب السعر المبدئي من TradingView', e);
  }
};

export const initPriceCapture = (timeoutMs: number = 2000) => {
  // تقليل وقت الانتظار قبل بدء التقاط السعر
  return setTimeout(() => {
    console.log('بدء التقاط السعر من الشارت CFI...');
    startPriceCapture();
  }, timeoutMs);
};

export const setupPriceUpdateChecker = (
  currentPriceRef: React.MutableRefObject<number | null>,
  priceProvider: string
) => {
  return setInterval(() => {
    // محاولة استخراج السعر مباشرة من العنصر المخصص
    const tradingViewPriceElement = document.querySelector('.tv-symbol-price-quote__value.js-symbol-last');
    if (tradingViewPriceElement) {
      const priceText = tradingViewPriceElement.textContent?.trim();
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        if (!isNaN(price) && price >= 1800 && price <= 3500) {
          console.log(`تم العثور على سعر في عنصر TradingView المخصص: ${price}`);
          
          // تحديث السعر المرجعي
          currentPriceRef.current = price;
          
          // إرسال حدث مع السعر المستخرج
          window.dispatchEvent(new CustomEvent('tradingview-price-update', {
            detail: {
              price,
              symbol: 'CFI:XAUUSD',
              timestamp: Date.now(),
              provider: priceProvider,
              source: 'extracted'
            }
          }));
          
          return;
        }
      }
    }
    
    // إذا لم يكن هناك سعر حالي، أطلب السعر
    if (currentPriceRef.current === null) {
      requestInitialPrice();
    } else {
      // تحديث السعر الحالي دوريًا حتى لو لم يتغير
      const price = currentPriceRef.current;
      
      // نشر السعر بجميع أنواع الأحداث المتاحة
      window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
        detail: { 
          price, 
          symbol: 'CFI:XAUUSD',
          timestamp: Date.now(),
          provider: priceProvider,
          source: 'extracted'
        }
      }));
    }
  }, 1000); // تقليل الفاصل الزمني لزيادة تكرار التحديثات
};
