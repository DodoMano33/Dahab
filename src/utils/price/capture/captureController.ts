
import { CAPTURE_INTERVAL } from './config';
import { 
  setCaptureInterval, 
  getCaptureInterval, 
  setCapturingState, 
  isCapturingActive, 
  resetState 
} from './state';
import { initOCR, cleanupOCR } from './ocrService';
import { extractAndBroadcastPrice } from './priceExtractor';

// بدء عملية التقاط السعر
export const startPriceCapture = async () => {
  if (isCapturingActive()) return;
  
  setCapturingState(true);
  
  // تهيئة محرك OCR إذا لم يكن موجودًا
  const success = await initOCR();
  if (!success) {
    setCapturingState(false);
    return;
  }
  
  // بدء التقاط الأسعار على فترات منتظمة
  const interval = setInterval(extractAndBroadcastPrice, CAPTURE_INTERVAL);
  setCaptureInterval(interval);
  console.log('تم بدء التقاط السعر');
  
  // استخراج السعر الأولي فورًا
  extractAndBroadcastPrice();
};

// إيقاف عملية التقاط السعر
export const stopPriceCapture = () => {
  if (!isCapturingActive()) return;
  
  const interval = getCaptureInterval();
  if (interval) {
    clearInterval(interval);
    setCaptureInterval(null);
  }
  
  setCapturingState(false);
  console.log('تم إيقاف التقاط السعر');
};

// إعادة ضبط الحالة
export const resetPriceCapture = () => {
  stopPriceCapture();
  resetState();
};

// تنظيف الموارد
export const cleanupPriceCapture = async () => {
  stopPriceCapture();
  await cleanupOCR();
  resetState();
};
