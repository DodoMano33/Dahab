
/**
 * الملف الرئيسي الذي يقوم بتصدير مكونات تحديث الأسعار
 */
import { PriceUpdater } from './core/PriceUpdater';
import { GoldPriceUpdater } from './updaters/goldPriceUpdater';
import { registerPriceEventListeners } from './events/priceEventListeners';

// إنشاء مثيل وحيد لمحدث الأسعار
export const priceUpdater = new PriceUpdater();

// إنشاء محدث سعر الذهب
const goldPriceUpdater = new GoldPriceUpdater(priceUpdater);

// تسجيل مستمعي أحداث الأسعار
if (typeof window !== 'undefined') {
  registerPriceEventListeners();
  
  // إضافة طلب فوري للسعر عند تحميل الصفحة
  setTimeout(() => {
    window.dispatchEvent(new Event('request-current-price'));
    window.dispatchEvent(new Event('request-extracted-price'));
    console.log('تم إرسال طلب فوري للحصول على السعر الحالي');
  }, 1000);
}

// بدء تحديثات سعر الذهب بشكل أكثر تكرارًا (كل 3 ثوانٍ)
goldPriceUpdater.start(3000);

// تصدير محدث سعر الذهب
export { goldPriceUpdater };
