
/**
 * استخراج السعر من النص المستخرج من الصورة
 * @param text النص المستخرج من الصورة
 * @returns السعر المستخرج أو null إذا لم يتم العثور على سعر
 */
export const extractPriceFromText = (text: string): number | null => {
  console.log('النص المستخرج من الصورة:', text);
  
  if (!text || text.trim() === '') {
    console.log('النص فارغ، لا يمكن استخراج سعر');
    return null;
  }
  
  // تنظيف النص من الأحرف غير المرغوب فيها
  const cleanedText = text.replace(/[^\d,.]/g, ' ').trim();
  console.log('النص بعد التنظيف:', cleanedText);
  
  // محاولة 1: البحث عن نمط الأرقام المكونة من 1-4 خانات أساسية و3 خانات عشرية بالضبط
  // مثال: 1234.567 أو 2345.678 أو 3,027.990
  const pricePattern = /\b(\d{1,4})[.,](\d{3})\b/g;
  const matches = text.match(pricePattern);
  
  console.log('الأرقام المطابقة للنمط (1-4 أرقام + 3 أرقام عشرية):', matches);
  
  if (matches && matches.length > 0) {
    // التحقق من كل مطابقة محتملة
    for (const match of matches) {
      const priceText = match.replace(',', '.');
      const price = parseFloat(priceText);
      
      // التحقق من أن السعر في النطاق المتوقع للذهب
      if (!isNaN(price) && price > 0) {
        if (price > 500 && price < 5000) {
          console.log('تم استخراج السعر بنجاح:', price);
          return price;
        }
      }
    }
  }
  
  // محاولة 2: البحث عن أنماط أخرى في النص الأصلي
  const digitsPattern = /(\d{1,4})[.,](\d{3})/g;
  let match;
  const possiblePrices = [];
  
  while ((match = digitsPattern.exec(text)) !== null) {
    const wholePart = match[1];
    const decimalPart = match[2];
    const formattedPrice = parseFloat(`${wholePart}.${decimalPart}`);
    
    if (!isNaN(formattedPrice) && formattedPrice > 0) {
      if (formattedPrice > 500 && formattedPrice < 5000) {
        possiblePrices.push(formattedPrice);
      }
    }
  }
  
  console.log('الأسعار المحتملة من النمط البديل:', possiblePrices);
  
  if (possiblePrices.length > 0) {
    // اختيار السعر الأكثر منطقية (عادةً أول سعر تم العثور عليه)
    return possiblePrices[0];
  }
  
  // محاولة 3: البحث عن أنماط مختلفة من الأرقام
  const generalNumberPattern = /(\d{1,4})[.,](\d{2,3})/g;
  const generalMatches = [];
  
  while ((match = generalNumberPattern.exec(text)) !== null) {
    const wholePart = match[1];
    const decimalPart = match[2].padEnd(3, '0').slice(0, 3); // تأكد من وجود 3 أرقام عشرية
    const formattedPrice = parseFloat(`${wholePart}.${decimalPart}`);
    
    if (!isNaN(formattedPrice) && formattedPrice > 0) {
      if (formattedPrice > 500 && formattedPrice < 5000) {
        console.log('تم استخراج سعر محتمل بتنسيق عام:', formattedPrice);
        generalMatches.push(formattedPrice);
      }
    }
  }
  
  if (generalMatches.length > 0) {
    return generalMatches[0];
  }
  
  // محاولة 4: البحث عن أرقام منفصلة وتنسيقها كسعر
  const numberMatches = text.match(/\d+/g);
  if (numberMatches && numberMatches.length >= 2) {
    // تجميع الأرقام الأولى للجزء الصحيح وآخر 3 أرقام للجزء العشري
    const wholePart = numberMatches.slice(0, -1).join('').slice(-4);
    const decimalPart = numberMatches[numberMatches.length - 1].slice(0, 3).padEnd(3, '0');
    
    if (wholePart && decimalPart) {
      const formattedPrice = parseFloat(`${wholePart}.${decimalPart}`);
      if (!isNaN(formattedPrice) && formattedPrice > 500 && formattedPrice < 5000) {
        console.log('تم تجميع السعر من أرقام منفصلة:', formattedPrice);
        return formattedPrice;
      }
    }
  }
  
  console.log('فشل في استخراج السعر من النص وفق التنسيق المطلوب');
  return null;
};
