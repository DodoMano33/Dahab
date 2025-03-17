
/**
 * الملف الرئيسي الذي يقوم بتصدير مكونات تحديث الأسعار
 */

import { PriceUpdater } from './core/PriceUpdater';

// إنشاء كائن مشترك لتحديث الأسعار
export const priceUpdater = new PriceUpdater();

// إطلاق طلب فوري للسعر عند تحميل الصفحة
if (typeof window !== 'undefined') {
  setTimeout(() => {
    window.dispatchEvent(new Event('request-extracted-price'));
    console.log('تم إرسال طلب فوري للحصول على السعر الحالي');
  }, 1000);
}

// تصدير أي وظائف إضافية إذا لزم الأمر
