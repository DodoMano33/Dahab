
/**
 * مكون متخصص للتعامل مع أحداث طلبات الأسعار
 */
import { priceUpdater } from '../priceUpdater';
import { broadcastGoldPriceUpdate } from './priceEventBroadcaster';

/**
 * تسجيل جميع مستمعي الأحداث لطلبات الأسعار
 */
export const registerPriceEventListeners = () => {
  if (typeof window === 'undefined') return;
  
  // الاستجابة لطلب السعر المستخرج
  window.addEventListener('request-extracted-price', () => {
    const lastPrice = priceUpdater.getLastGoldPrice();
    if (lastPrice !== null) {
      console.log('الاستجابة لطلب السعر المستخرج من priceUpdater:', lastPrice);
      broadcastGoldPriceUpdate(lastPrice);
    }
  });
  
  // الاستجابة لطلبات السعر الحالي
  window.addEventListener('request-current-price', () => {
    const lastPrice = priceUpdater.getLastGoldPrice();
    if (lastPrice !== null) {
      console.log('الاستجابة لطلب السعر الحالي من priceUpdater:', lastPrice);
      broadcastGoldPriceUpdate(lastPrice);
    }
  });
  
  // استجابة لطلبات من واجهة المستخدم المباشرة
  window.addEventListener('request-ui-price-update', () => {
    const lastPrice = priceUpdater.getLastGoldPrice();
    if (lastPrice !== null) {
      console.log('الاستجابة لطلب تحديث السعر من واجهة المستخدم:', lastPrice);
      broadcastGoldPriceUpdate(lastPrice, 'CFI:XAUUSD', 'alphavantage');
    }
  });
  
  console.log('تم تسجيل مستمعي أحداث الأسعار');
};
