
import { captureElement, getPriceElementOrFind } from './elementFinder';
import { extractTextFromImage, parseExtractedText } from './ocrService';
import { isCapturingActive, setLastExtractedPrice } from './state';

// نشر تحديث السعر في جميع أنحاء التطبيق
export const broadcastPrice = (price: number) => {
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
    if (directText) {
      const directPrice = parseExtractedText(directText);
      if (directPrice !== null) {
        return directPrice;
      }
    }
    
    // استخدام OCR كخطة احتياطية
    const imageData = await captureElement(priceElement);
    const extractedText = await extractTextFromImage(imageData);
    console.log('النص المستخرج من OCR:', extractedText);
    
    const price = parseExtractedText(extractedText);
    if (price !== null) {
      return price;
    }
    
    return null;
  } catch (error) {
    console.error('فشل في استخراج السعر من الشارت:', error);
    return null;
  }
};

// الدالة الرئيسية لاستخراج السعر وبثه
export const extractAndBroadcastPrice = async () => {
  try {
    if (!isCapturingActive()) return;
    
    const price = await extractPriceFromChart();
    if (price !== null) {
      const lastPrice = await import('./state').then(m => m.getLastExtractedPrice());
      // نشر السعر فقط إذا تغير بشكل ملحوظ
      if (lastPrice === null || Math.abs(price - lastPrice) > 0.001) {
        broadcastPrice(price);
      }
    }
  } catch (error) {
    console.error('فشل في استخراج السعر:', error);
  }
};
