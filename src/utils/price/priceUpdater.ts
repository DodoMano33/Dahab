
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
  
  // تحقق من وجود حالة Alpha Vantage في التخزين المحلي
  const alphaVantageEnabled = localStorage.getItem('alpha_vantage_enabled');
  if (alphaVantageEnabled === 'false') {
    goldPriceUpdater.setUseAlphaVantage(false);
    console.log('تم تعطيل استخدام Alpha Vantage من التخزين المحلي');
  }
}

// بدء تحديثات سعر الذهب بشكل أكثر تكرارًا (كل 3 ثوانٍ)
goldPriceUpdater.start(3000);

// تصدير محدث سعر الذهب
export { goldPriceUpdater };
