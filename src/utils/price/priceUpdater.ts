
// ملف وسيط للحفاظ على التوافق مع الشيفرة الحالية

import { PriceUpdater, priceUpdater } from './updater';

// تصدير الفئة الرئيسية ونسخة عامة منها
export { PriceUpdater, priceUpdater };

// وظائف مساعدة للتوافق مع الواجهة السابقة
export class PriceUpdaterLegacy extends PriceUpdater {
  // وظائف إضافية للتوافق مع الكود القديم إذا لزم الأمر
  retry<T>(fn: () => Promise<T>, maxAttempts: number = 3): Promise<T> {
    return super['retry'](fn, { maxAttempts, initialDelay: 1000 });
  }
}

// استبدال النسخة العامة بنسخة متوافقة مع الواجهة السابقة إذا لزم الأمر
// (هذا غير ضروري حاليًا لأن التغييرات متوافقة بشكل كبير)
