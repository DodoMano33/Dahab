
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
        // ضبط إعدادات التعرف للتركيز على الأرقام والأسعار
        tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
        tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT
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
