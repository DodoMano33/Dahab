
import Tesseract from 'tesseract.js';
import { enhanceImageForOcr } from '@/utils/price/image/imageEnhancer';

/**
 * معالجة الصورة باستخدام OCR لاستخراج النص
 * @param imageUrl رابط الصورة المراد معالجتها
 * @returns وعد بالنص المستخرج من الصورة
 */
export const recognizeTextFromImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log('بدء معالجة الصورة باستخدام OCR...');
    
    if (!imageUrl || imageUrl.length < 100) {
      console.error('الصورة المدخلة غير صالحة');
      return '';
    }
    
    // تحسين الصورة قبل معالجتها
    console.log('تحسين الصورة قبل معالجتها...');
    const enhancedImageUrl = await enhanceImageForOcr(imageUrl);
    console.log('تم تحسين الصورة بنجاح');
    
    // إعدادات متقدمة للتعرف على النص
    const result = await Tesseract.recognize(
      enhancedImageUrl,
      'eng', // نستخدم اللغة الإنجليزية لاستخراج الأرقام
      { 
        logger: message => console.log('Tesseract:', message),
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        cachePath: '.',
        errorHandler: error => console.error('Tesseract error:', error),
        // تحسين دقة التعرف على الأرقام
        tessedit_char_whitelist: '0123456789.,',
        // تهيئة Tesseract لأن تكون أكثر دقة مع الأرقام
        tessedit_ocr_engine_mode: 1
      }
    );
    
    const extractedText = result.data.text;
    console.log('النص المستخرج من Tesseract:', extractedText);
    
    // محاولة استخراج الأرقام من النص باستخدام تعبير منتظم
    const numbersOnly = extractedText.replace(/[^\d.,]/g, ' ').trim();
    console.log('الأرقام المستخرجة من النص:', numbersOnly);
    
    return extractedText + ' ' + numbersOnly;
  } catch (error) {
    console.error('خطأ في معالجة الصورة باستخدام OCR:', error);
    return '';
  }
};
