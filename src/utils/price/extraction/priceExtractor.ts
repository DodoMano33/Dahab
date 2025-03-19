
/**
 * استخراج سعر الذهب من النص المستخرج
 * @param text النص المستخرج من الصورة
 * @returns السعر المستخرج كرقم أو null إذا لم يتم العثور على سعر صالح
 */
export const extractPriceFromText = (text: string): number | null => {
  if (!text) return null;
  
  console.log("استخراج السعر من النص:", text);
  
  // تنظيف النص وإزالة الأحرف غير الأرقام والأرقام العشرية والفواصل
  const cleanedText = text.replace(/[^\d.,]/g, ' ');
  console.log("النص بعد التنظيف:", cleanedText);
  
  // محاولة 1: البحث عن نمط سعر الذهب النموذجي (مثل 3065.48)
  const goldPattern = /\b([1-9]\d{3}\.?\d{0,2})\b/;
  const goldMatch = text.match(goldPattern);
  
  if (goldMatch && goldMatch[1]) {
    const price = parseFloat(goldMatch[1]);
    console.log("تم استخراج سعر الذهب من النمط الأساسي:", price);
    if (!isNaN(price) && price > 1000 && price < 9000) {
      return price;
    }
  }
  
  // محاولة 2: البحث عن أنماط متعددة لسعر الذهب
  const patterns = [
    /\b([1-9]),?(\d{3})\.(\d{1,2})\b/, // نمط مع فاصلة مثل 3,065.48
    /\b([1-9])(\d{3})\.(\d{1,2})\b/,   // نمط بدون فاصلة مثل 3065.48
    /\b([1-9])(\d{2,3})\.(\d{1,2})\b/, // نمط مرن للأرقام
    /(\d{1,4})[.,](\d{1,2})/,         // نمط مرن أكثر للأرقام
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let price;
      if (match.length === 4) {
        // نمط مع مجموعات متعددة (الأرقام مفصولة)
        if (match[2].length === 3) {
          // نمط مثل 3,065.48 أو 3065.48
          price = parseFloat(`${match[1]}${match[2]}.${match[3]}`);
        } else {
          // نمط آخر
          const combinedDigits = match[1] + match[2];
          price = parseFloat(`${combinedDigits}.${match[3]}`);
        }
      } else {
        // نمط بسيط
        price = parseFloat(match[0].replace(/,/g, '.'));
      }
      
      console.log("تم استخراج سعر محتمل من النمط الثانوي:", price);
      if (!isNaN(price) && price > 1000 && price < 9000) {
        return price;
      }
    }
  }
  
  // محاولة 3: البحث عن أي رقم يشبه سعر الذهب
  // تقسيم النص إلى كلمات وتحليل كل واحدة
  const words = cleanedText.split(/\s+/).filter(Boolean);
  console.log("الكلمات المستخرجة:", words);
  
  for (const word of words) {
    // تنظيف الكلمة من أي أحرف غير الأرقام والنقطة
    const cleanWord = word.replace(/[^\d.]/g, '');
    if (cleanWord.length > 0 && cleanWord.includes('.')) {
      const price = parseFloat(cleanWord);
      console.log("سعر محتمل من كلمة:", price);
      
      if (!isNaN(price)) {
        // التحقق من نطاق سعر الذهب
        if (price > 1000 && price < 9000) {
          console.log("تم العثور على سعر ذهب محتمل:", price);
          return price;
        }
        // التعامل مع أسعار مثل 3.06 (تعني 3060)
        else if (price > 1 && price < 10) {
          const adjustedPrice = price * 1000;
          console.log("تعديل السعر من:", price, "إلى:", adjustedPrice);
          return adjustedPrice;
        }
      }
    }
  }
  
  // محاولة 4: البحث عن أرقام في النص الأصلي
  const allNumbers = text.match(/\d+\.\d+|\d+/g);
  if (allNumbers) {
    console.log("جميع الأرقام المستخرجة:", allNumbers);
    
    // البحث عن أرقام قريبة من نطاق سعر الذهب
    for (const num of allNumbers) {
      const price = parseFloat(num);
      if (!isNaN(price)) {
        if (price > 1000 && price < 9000) {
          console.log("سعر محتمل من الأرقام المستخرجة:", price);
          return price;
        }
      }
    }
    
    // البحث عن الأرقام الكبيرة (قد تكون سعر الذهب بدون نقطة عشرية)
    for (const num of allNumbers) {
      const price = parseFloat(num);
      if (!isNaN(price) && price > 100 && price < 999) {
        // قد يكون هذا الرقم في الواقع 2000+
        const adjustedPrice = price * 10;
        if (adjustedPrice > 1000 && adjustedPrice < 9000) {
          console.log("تعديل الرقم الكبير من:", price, "إلى:", adjustedPrice);
          return adjustedPrice;
        }
      }
    }
  }
  
  console.log("لم يتم العثور على سعر صالح في النص");
  return null;
};
