
import { MIN_VALID_GOLD_PRICE, MAX_VALID_GOLD_PRICE } from '../types';

/**
 * وظيفة لتنظيف النص واستخراج السعر منه
 */
export const cleanPriceText = (text: string, debugMode: boolean = false): number | null => {
  try {
    // إزالة أي نص غير رقمي ماعدا النقطة والفاصلة
    let cleanedText = text.replace(/[^\d.,]/g, '');
    
    // استبدال الفواصل بنقاط للحصول على رقم صالح
    cleanedText = cleanedText.replace(/,/g, '.');
    
    // البحث عن نمط رقم بعلامة عشرية
    const match = cleanedText.match(/\d+(?:\.\d+)?/);
    if (match) {
      const extractedPrice = parseFloat(match[0]);
      
      // التحقق من أن السعر منطقي لسعر الذهب
      if (!isNaN(extractedPrice) && 
          extractedPrice >= MIN_VALID_GOLD_PRICE && 
          extractedPrice <= MAX_VALID_GOLD_PRICE) {
        return extractedPrice;
      } else {
        if (debugMode) {
          console.warn(`تم استخراج سعر خارج النطاق المنطقي: ${extractedPrice}`);
        }
      }
    } else {
      // محاولة تحويل النص بالكامل إلى رقم
      const fullNumber = parseFloat(cleanedText);
      
      // التحقق من أن السعر منطقي لسعر الذهب
      if (!isNaN(fullNumber) && 
          fullNumber >= MIN_VALID_GOLD_PRICE && 
          fullNumber <= MAX_VALID_GOLD_PRICE) {
        return fullNumber;
      } else {
        if (debugMode) {
          console.warn(`تم استخراج سعر كامل خارج النطاق المنطقي: ${fullNumber}`);
        }
      }
    }
  } catch (error) {
    if (debugMode) {
      console.error('Error cleaning price text:', error, text);
    }
  }
  
  return null;
};
