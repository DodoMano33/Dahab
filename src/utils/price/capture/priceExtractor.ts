
import { captureElement, getPriceElementOrFind } from './elementFinder';
import { extractTextFromImage, parseExtractedText } from './ocrService';
import { isCapturingActive, setLastExtractedPrice, getLastExtractedPrice } from './state';

// نشر تحديث السعر في جميع أنحاء التطبيق
export const broadcastPrice = (price: number) => {
  const lastPrice = getLastExtractedPrice();
  
  // تجنب البث المتكرر لنفس السعر، والتحقق من معقولية القيمة
  if (lastPrice === price) {
    return;
  }
  
  // التحقق من معقولية السعر للذهب (بين 500 و 5000 دولار)
  if (price < 500 || price > 5000) {
    console.warn('تم استبعاد قيمة سعر غير معقولة:', price);
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
      // تنظيف النص من أي أحرف غير رقمية باستثناء النقطة العشرية أو الفاصلة
      const cleanText = cleanPriceText(directText);
      console.log('النص بعد التنظيف:', cleanText);
      
      const price = parseFloat(cleanText.replace(',', '.'));
      if (!isNaN(price) && price > 0) {
        // التحقق من معقولية السعر (سعر الذهب عادة بين 500 و 5000 دولار)
        if (price > 500 && price < 5000) {
          console.log('تم استخراج سعر ذهب معقول مباشرة من النص:', price);
          return price;
        } else {
          console.log('تم استخراج سعر خارج النطاق المتوقع للذهب:', price);
          // يمكن تجربة OCR كخطة بديلة أو التحقق من الإعدادات
        }
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
      
      const price = parseFloat(cleanText.replace(',', '.'));
      if (!isNaN(price) && price > 0 && price > 500 && price < 5000) {
        console.log('تم استخراج سعر الذهب من OCR:', price);
        return price;
      }
    }
    
    // محاولة استخدام تحليل محسّن للنص
    const price = parseExtractedText(extractedText);
    if (price !== null && price > 500 && price < 5000) {
      console.log('تم استخراج سعر الذهب باستخدام تحليل محسّن:', price);
      return price;
    }
    
    console.log('فشل في استخراج سعر الذهب من النص والصورة');
    return null;
  } catch (error) {
    console.error('فشل في استخراج السعر من الشارت:', error);
    return null;
  }
};

// تنظيف نص السعر باستخدام طرق متعددة
const cleanPriceText = (text: string): string => {
  if (!text) return '';
  
  // 1. إزالة كل الأحرف ما عدا الأرقام والنقطة العشرية والفاصلة
  let cleanText = text.replace(/[^\d.,]/g, '');
  
  // 2. التعامل مع الفواصل والنقاط بناءً على سياق النص
  if (cleanText.includes(',') && cleanText.includes('.')) {
    // إذا كان النص يحتوي على نقطة وفاصلة، افترض أن التنسيق هو 1,234.56
    const parts = cleanText.split('.');
    if (parts.length > 1 && parts[1].length <= 4) {
      // الاحتفاظ بالنقطة العشرية وإزالة الفواصل
      cleanText = parts[0].replace(/,/g, '') + '.' + parts[1];
    } else {
      // ربما الفاصلة هي العلامة العشرية والنقطة للآلاف
      cleanText = cleanText.replace(/\./g, '').replace(',', '.');
    }
  } else if (cleanText.includes(',')) {
    // إذا كان النص يحتوي على فاصلة فقط
    // افحص إذا كانت الفاصلة تُستخدم كعلامة عشرية (مثل 1234,56)
    if (cleanText.split(',')[1]?.length <= 4) {
      cleanText = cleanText.replace(',', '.');
    } else {
      // الفاصلة تُستخدم للآلاف (مثل 1,234)
      cleanText = cleanText.replace(/,/g, '');
    }
  }
  
  // 3. التأكد من وجود نقطة عشرية واحدة فقط
  if (cleanText.includes('.')) {
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      // أخذ أول رقم والجزء العشري
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
      // استخدام نسبة مئوية للتغيير بدلاً من قيمة ثابتة (0.01٪ من السعر)
      const minChangeThreshold = price * 0.0001;
      
      if (lastPrice === null || Math.abs(price - lastPrice) > minChangeThreshold) {
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
