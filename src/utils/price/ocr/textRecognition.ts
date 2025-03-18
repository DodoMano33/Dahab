
import Tesseract from 'tesseract.js';

/**
 * معالجة الصورة باستخدام OCR لاستخراج النص
 * @param imageUrl رابط الصورة المراد معالجتها
 * @returns وعد بالنص المستخرج من الصورة
 */
export const recognizeTextFromImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log('بدء معالجة الصورة باستخدام OCR...');
    
    const result = await Tesseract.recognize(
      imageUrl,
      'eng', // نستخدم اللغة الإنجليزية لاستخراج الأرقام
      { 
        logger: message => console.log('Tesseract:', message)
        // تمت إزالة tessedit_char_whitelist لأنه غير مدعوم في التعريف الحالي للـ WorkerOptions
      }
    );
    
    const extractedText = result.data.text;
    console.log('النص المستخرج من Tesseract:', extractedText);
    
    return extractedText;
  } catch (error) {
    console.error('خطأ في معالجة الصورة باستخدام OCR:', error);
    return '';
  }
};
