
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
    // إرسال طلب السعر الحالي
    window.dispatchEvent(new Event('request-current-price'));
    
    // مباشرة عبر postMessage
    window.postMessage({ method: 'getCurrentPrice', symbol: 'CFI:XAUUSD', provider: 'CFI' }, '*');
    
    // طلب تحديث فوري من نظام استخراج السعر
    requestImmediatePriceUpdate();
    
    // تحقق من السعر المعروض في الشارت وأرسله كتحديث
    const chartPriceElement = document.querySelector('.chart-price-display');
    if (chartPriceElement && chartPriceElement.textContent) {
      const priceText = chartPriceElement.textContent.trim();
      const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
      if (!isNaN(price) && price > 0) {
        window.dispatchEvent(new CustomEvent('chart-price-update', {
          detail: {
            price,
            symbol: 'CFI:XAUUSD',
            timestamp: Date.now(),
            provider: 'CFI',
            source: 'direct-chart'
          }
        }));
      }
    }
    
    console.log('تم إرسال طلب الحصول على السعر الحالي من CFI بجميع الطرق المتاحة');
  } catch (e) {
    console.warn('فشل في طلب السعر المبدئي من TradingView', e);
  }
};

export const initPriceCapture = (timeoutMs: number = 5000) => {
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
    // إذا لم يكن هناك سعر حالي، أطلب السعر
    if (currentPriceRef.current === null) {
      requestInitialPrice();
    } else {
      // تحديث السعر الحالي دوريًا حتى لو لم يتغير
      window.dispatchEvent(new CustomEvent('chart-price-update', { 
        detail: { 
          price: currentPriceRef.current, 
          symbol: 'CFI:XAUUSD',
          timestamp: Date.now(),
          provider: priceProvider,
          source: 'periodic-update'
        }
      }));
    }
  }, 10000);
};
