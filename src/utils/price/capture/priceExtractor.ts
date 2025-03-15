
import { captureElement, getPriceElementOrFind } from './elementFinder';
import { extractTextFromImage, parseExtractedText } from './ocrService';
import { isCapturingActive, setLastExtractedPrice, getLastExtractedPrice } from './state';

// نشر تحديث السعر في جميع أنحاء التطبيق
export const broadcastPrice = (price: number) => {
  const lastPrice = getLastExtractedPrice();
  
  // تفادي النشر المتكرر للسعر نفسه
  if (lastPrice === price) {
    return;
  }
  
  setLastExtractedPrice(price);
  
  // إرسال حدث تحديث السعر
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price,
      symbol: 'CFI:XAUUSD',
      timestamp: Date.now()
    }
  }));
  
  console.log('تم نشر تحديث السعر:', price);
};

// استخراج السعر من عنصر الشارت
export const extractPriceFromChart = async (): Promise<number | null> => {
  try {
    // البحث عن عنصر السعر
    const priceElement = getPriceElementOrFind();
    if (!priceElement) {
      console.warn('لم يتم العثور على عنصر السعر في الشارت');
      return null;
    }
    
    // محاولة قراءة النص مباشرة من العنصر
    const directText = priceElement.textContent?.trim();
    console.log('النص المستخرج من العنصر مباشرة:', directText);
    
    if (directText) {
      // تنظيف النص من أي أحرف غير رقمية باستثناء النقطة العشرية
      const cleanText = cleanPriceText(directText);
      console.log('النص بعد التنظيف:', cleanText);
      
      const price = parseFloat(cleanText);
      if (!isNaN(price) && price > 0) {
        console.log('تم استخراج السعر مباشرة من النص:', price);
        return price;
      }
    }
    
    // استخدام OCR كخطة احتياطية
    console.log('جاري استخدام OCR لاستخراج السعر...');
    const imageData = await captureElement(priceElement);
    const extractedText = await extractTextFromImage(imageData);
    console.log('النص المستخرج من OCR:', extractedText);
    
    if (extractedText) {
      const cleanText = cleanPriceText(extractedText);
      console.log('نص OCR بعد التنظيف:', cleanText);
      
      const price = parseFloat(cleanText);
      if (!isNaN(price) && price > 0) {
        console.log('تم استخراج السعر من OCR:', price);
        return price;
      }
    }
    
    // محاولة استخدام تحليل محسّن للنص
    const price = parseExtractedText(extractedText);
    if (price !== null) {
      console.log('تم استخراج السعر باستخدام تحليل محسّن:', price);
      return price;
    }
    
    console.log('فشل في استخراج السعر من النص والصورة');
    return null;
  } catch (error) {
    console.error('فشل في استخراج السعر من الشارت:', error);
    return null;
  }
};

// تنظيف نص السعر
const cleanPriceText = (text: string): string => {
  // إزالة كل الأحرف ما عدا الأرقام والنقطة العشرية
  let cleanText = text.replace(/[^\d.]/g, '');
  
  // التحقق من وجود نقطة عشرية صالحة
  if (cleanText.includes('.')) {
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      // إذا كان هناك أكثر من نقطة عشرية، نأخذ الجزء الأول والثاني فقط
      cleanText = parts[0] + '.' + parts[1];
    }
  }
  
  return cleanText;
};

// الدالة الرئيسية لاستخراج السعر وبثه
export const extractAndBroadcastPrice = async () => {
  try {
    if (!isCapturingActive()) {
      console.log('عملية التقاط السعر غير نشطة حالياً');
      return;
    }
    
    console.log('بدء عملية استخراج السعر...');
    const price = await extractPriceFromChart();
    if (price !== null) {
      const lastPrice = getLastExtractedPrice();
      
      // نشر السعر فقط إذا تغير بشكل ملحوظ أو كان هذا أول سعر
      const priceThreshold = 0.01; // عتبة أكثر حساسية للتغييرات
      if (lastPrice === null || Math.abs(price - lastPrice) > priceThreshold) {
        console.log('تم اكتشاف تغيير في السعر، جاري البث...');
        broadcastPrice(price);
      } else {
        console.log('لم يتغير السعر بشكل كافٍ للبث:', price, 'آخر سعر:', lastPrice);
      }
    } else {
      console.log('لم يتم استخراج سعر صالح');
    }
  } catch (error) {
    console.error('فشل في استخراج السعر:', error);
  }
};
