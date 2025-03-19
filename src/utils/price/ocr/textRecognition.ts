
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
        // تم إزالة الخيارات غير المدعومة
      }
    );
    
    const extractedText = result.data.text;
    console.log('النص المستخرج من Tesseract:', extractedText);
    
    // تحسين استخراج الأرقام من النص بتعبير منتظم أكثر تحديدًا
    const cleanedText = extractedText.replace(/[^\d.,]/g, ' ').trim();
    const numbersMatch = cleanedText.match(/\b\d{1,4}[.,]\d{1,2}\b/g);
    
    // تحاول استخراج الأرقام بتنسيق 4 أرقام + نقطة + رقمين مثل 3028.90 أو 3028.9
    const specificPattern = extractedText.match(/\b\d{4}[.,]\d{1,2}\b/g);
    
    console.log('الأنماط المحددة المستخرجة:', specificPattern);
    console.log('الأرقام المستخرجة من النص:', numbersMatch);
    
    let processedText = extractedText;
    
    // إذا وجدنا نمطًا محددًا، نعطيه الأولوية
    if (specificPattern && specificPattern.length > 0) {
      processedText += ' ' + specificPattern.join(' ');
    } else if (numbersMatch && numbersMatch.length > 0) {
      processedText += ' ' + numbersMatch.join(' ');
    } else {
      processedText += ' ' + cleanedText;
    }
    
    return processedText;
  } catch (error) {
    console.error('خطأ في معالجة الصورة باستخدام OCR:', error);
    return '';
  }
};
