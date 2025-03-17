
// ملف التصدير الرئيسي - يقوم بتصدير واجهة العمل مع خدمة التقاط السعر

// تصدير واجهة التحكم بالتقاط
export {
  startPriceCapture,
  stopPriceCapture,
  resetPriceCapture,
  cleanupPriceCapture,
  extractAndBroadcastPrice
} from './capture/captureController';

// تصدير وظائف الحالة
export {
  getLastExtractedPrice
} from './capture/state';

// تصدير وظائف استخراج السعر
export {
  extractPriceFromChart,
  requestImmediatePriceUpdate
} from './capture/priceExtractor';

// تصدير أنواع البيانات إذا كانت مطلوبة
export type { } from './types';
