
import Tesseract from 'tesseract.js';

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
    
    // إعدادات متقدمة للتعرف على النص
    const result = await Tesseract.recognize(
      imageUrl,
      'eng', // نستخدم اللغة الإنجليزية لاستخراج الأرقام
      { 
        logger: message => console.log('Tesseract:', message),
        // استخدام إعدادات متوافقة مع TypeScript للتركيز على الأرقام والأسعار
        // تم حذف الإعدادات غير المدعومة في Tesseract.js v5
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
