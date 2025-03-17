
/**
 * الملف الرئيسي الذي يقوم بتصدير مكونات تحديث الأسعار
 */

// إطلاق طلب فوري للسعر عند تحميل الصفحة
if (typeof window !== 'undefined') {
  setTimeout(() => {
    window.dispatchEvent(new Event('request-extracted-price'));
    console.log('تم إرسال طلب فوري للحصول على السعر الحالي');
  }, 1000);
}

// تصدير أي وظائف إضافية إذا لزم الأمر
export { };
