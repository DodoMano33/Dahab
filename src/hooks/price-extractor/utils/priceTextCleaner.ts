
import { MIN_VALID_GOLD_PRICE, MAX_VALID_GOLD_PRICE } from '../types';

/**
 * خوارزمية محسنة لتنظيف النص واستخراج السعر منه
 * تتضمن تحققات إضافية من صحة السعر
 */
export const cleanPriceText = (text: string, debugMode: boolean = false): number | null => {
  try {
    if (!text) return null;
    
    // تحقق 1: التأكد من أن النص يحتوي على أرقام
    if (!/\d/.test(text)) {
      if (debugMode) console.warn('النص لا يحتوي على أرقام:', text);
      return null;
    }
    
    // تحسين استخراج الأرقام من النص
    let cleanedText = text.trim();
    
    // تحقق 2: تجاهل النصوص الطويلة جدًا (غالبًا ليست أسعارًا)
    if (cleanedText.length > 30) {
      if (debugMode) console.warn('النص طويل جدًا ليكون سعرًا:', cleanedText);
      return null;
    }
    
    // تحقق 3: تجاهل النصوص التي تحتوي على كلمات معينة تشير إلى أنها ليست أسعارًا
    const excludeWords = ['percent', '%', 'total', 'score', 'point', 'مؤشر', 'نقطة'];
    if (excludeWords.some(word => cleanedText.toLowerCase().includes(word))) {
      if (debugMode) console.warn('النص يحتوي على كلمات غير مرتبطة بالسعر:', cleanedText);
      return null;
    }
    
    // إزالة أي نص غير رقمي ماعدا النقطة والفاصلة
    cleanedText = cleanedText.replace(/[^\d.,]/g, '');
    
    // استبدال الفواصل بنقاط للحصول على رقم صالح
    cleanedText = cleanedText.replace(/,/g, '.');
    
    // تحقق 4: البحث عن نمط رقم بعلامة عشرية
    const match = cleanedText.match(/\d+(?:\.\d+)?/);
    if (match) {
      const extractedPrice = parseFloat(match[0]);
      
      // تحقق 5: التحقق من أن السعر منطقي لسعر الذهب
      if (!isNaN(extractedPrice)) {
        // تحقق 6: التأكد أن السعر في النطاق المنطقي
        if (extractedPrice >= MIN_VALID_GOLD_PRICE && extractedPrice <= MAX_VALID_GOLD_PRICE) {
          return extractedPrice;
        } else if (debugMode) {
          console.warn(`سعر خارج النطاق المنطقي: ${extractedPrice} (الحد الأدنى: ${MIN_VALID_GOLD_PRICE}, الحد الأقصى: ${MAX_VALID_GOLD_PRICE})`);
        }
      }
    }
    
    // تحقق 7: محاولة أخيرة - تحويل النص بالكامل إلى رقم
    const fullNumber = parseFloat(cleanedText);
    if (!isNaN(fullNumber)) {
      // تحقق من أن السعر في النطاق المنطقي
      if (fullNumber >= MIN_VALID_GOLD_PRICE && fullNumber <= MAX_VALID_GOLD_PRICE) {
        return fullNumber;
      } else if (debugMode) {
        console.warn(`السعر الكامل خارج النطاق المنطقي: ${fullNumber} (الحد الأدنى: ${MIN_VALID_GOLD_PRICE}, الحد الأقصى: ${MAX_VALID_GOLD_PRICE})`);
      }
    } else if (debugMode) {
      console.warn('فشل في استخراج رقم صالح من النص:', text);
    }
  } catch (error) {
    if (debugMode) {
      console.error('خطأ أثناء تنظيف نص السعر:', error, text);
    }
  }
  
  return null;
};

/**
 * وظيفة إضافية للتحقق من صحة السعر باستخدام الذاكرة المؤقتة
 * تساعد في تجنب القيم المتطرفة
 */
export const validatePriceWithHistory = (
  price: number | null, 
  lastValidPrice: number | null, 
  maxPercentChange: number = 5,
  debugMode: boolean = false
): number | null => {
  // إذا كان السعر غير صالح، أرجع null
  if (price === null || isNaN(price)) return null;
  
  // تحقق 1: التأكد من أن السعر في النطاق المنطقي
  if (price < MIN_VALID_GOLD_PRICE || price > MAX_VALID_GOLD_PRICE) {
    if (debugMode) {
      console.warn(`سعر خارج النطاق المنطقي: ${price}`);
    }
    return null;
  }
  
  // تحقق 2: إذا كان هذا أول سعر صالح، نقبله مباشرة
  if (lastValidPrice === null) return price;
  
  // تحقق 3: مقارنة التغيير بالنسبة المئوية مع السعر الأخير
  const percentChange = Math.abs((price - lastValidPrice) / lastValidPrice * 100);
  
  if (percentChange > maxPercentChange) {
    if (debugMode) {
      console.warn(`تغير السعر كبير جدًا: ${percentChange.toFixed(2)}% (من ${lastValidPrice} إلى ${price})`);
    }
    return null;
  }
  
  return price;
};
