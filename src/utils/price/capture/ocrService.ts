
import { createWorker } from 'tesseract.js';
import { getOcrWorker, setOcrWorker } from './state';

// تهيئة محرك OCR
export const initOCR = async (): Promise<boolean> => {
  try {
    console.log('تهيئة محرك OCR...');
    const worker = await createWorker('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789.',
    });
    
    setOcrWorker(worker);
    console.log('تم تهيئة محرك OCR بنجاح');
    return true;
  } catch (error) {
    console.error('فشل في تهيئة محرك OCR:', error);
    return false;
  }
};

// استخراج النص من الصورة باستخدام OCR
export const extractTextFromImage = async (imageData: string): Promise<string> => {
  const worker = getOcrWorker();
  if (!worker) {
    throw new Error('لم يتم تهيئة محرك OCR');
  }
  
  try {
    const { data } = await worker.recognize(imageData);
    return data.text.trim();
  } catch (error) {
    console.error('فشل في استخراج النص من الصورة:', error);
    throw error;
  }
};

// تحويل النص المستخرج إلى رقم
export const parseExtractedText = (text: string): number | null => {
  // إزالة أي أحرف غير رقمية باستثناء النقطة العشرية
  const cleanedText = text.replace(/[^\d.]/g, '');
  
  // التحقق من وجود رقم واحد على الأقل ونقطة عشرية واحدة على الأكثر
  if (/^\d*\.?\d+$/.test(cleanedText)) {
    const number = parseFloat(cleanedText);
    if (!isNaN(number) && number > 0) {
      return number;
    }
  }
  
  return null;
};

// إغلاق وتنظيف محرك OCR
export const cleanupOCR = async (): Promise<void> => {
  const worker = getOcrWorker();
  if (worker) {
    await worker.terminate();
    setOcrWorker(null);
  }
};
