
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
        errorHandler: error => console.error('Tesseract error:', error)
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
