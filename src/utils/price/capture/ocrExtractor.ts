
/**
 * وحدة استخراج السعر باستخدام OCR
 */

import { extractTextFromImage, parseExtractedText } from './ocrService';
import { captureElement } from './elementCapture';
import { cleanPriceText } from './priceTextCleaner';
import { isReasonableGoldPrice } from './validators';

/**
 * استخراج السعر باستخدام OCR
 */
export const extractPriceUsingOCR = async (priceElement: HTMLElement): Promise<number | null> => {
  try {
    console.log('جاري استخدام OCR لاستخراج السعر...');
    const imageData = await captureElement(priceElement);
    const extractedText = await extractTextFromImage(imageData);
    console.log('النص المستخرج من OCR:', extractedText);
    
    if (extractedText) {
      const cleanText = cleanPriceText(extractedText);
      console.log('نص OCR بعد التنظيف:', cleanText);
      
      const price = parseFloat(cleanText.replace(',', '.'));
      if (!isNaN(price) && price > 0 && isReasonableGoldPrice(price)) {
        console.log('تم استخراج سعر الذهب من OCR:', price);
        return price;
      }
    }
    
    // محاولة استخدام تحليل محسّن للنص
    const price = parseExtractedText(extractedText);
    if (price !== null && isReasonableGoldPrice(price)) {
      console.log('تم استخراج سعر الذهب باستخدام تحليل محسّن:', price);
      return price;
    }
    
    console.log('فشل في استخراج سعر الذهب من النص والصورة');
    return null;
  } catch (error) {
    console.error('فشل في استخراج السعر من الصورة:', error);
    return null;
  }
};
