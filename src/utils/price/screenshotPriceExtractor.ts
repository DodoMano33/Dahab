
// ملف التصدير الرئيسي - يقوم بتصدير واجهة العمل مع خدمة التقاط السعر

// تصدير واجهة التحكم بالتقاط
export {
  startPriceCapture,
  stopPriceCapture,
  resetPriceCapture,
  cleanupPriceCapture
} from './capture/captureController';

// تصدير وظائف الحالة
export {
  getLastExtractedPrice
} from './capture/state';

// تصدير أنواع البيانات إذا كانت مطلوبة
export type { } from './types';
