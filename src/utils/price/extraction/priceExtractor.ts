
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
  
  // ابحث عن أي رقم يبدأ بـ 3 أرقام مثل 302 أو 301 أو 302X
  // هذا لتحسين استخراج أسعار الذهب الحالية التي تتراوح حول 3000+
  const goldSpecificPattern = /\b3[0-9]{2}[0-9,.]*\b/g;
  const goldMatches = text.match(goldSpecificPattern);
  
  if (goldMatches && goldMatches.length > 0) {
    for (const match of goldMatches) {
      // تنظيف المطابقة للحصول على سعر صالح
      const cleanMatch = match.replace(/[^\d.,]/g, '').replace(/,/g, '.');
      let price = parseFloat(cleanMatch);
      
      if (!isNaN(price)) {
        // إذا كان الرقم صغيرًا جدًا، ربما يكون بحاجة للضرب بـ 1000
        if (price > 3 && price < 10) {
          price *= 1000;
        }
        
        if (price > 2000 && price < 4000) {
          console.log('تم العثور على سعر ذهب محتمل بنمط مخصص:', price);
          return price;
        }
      }
    }
  }
  
  // البحث عن "دولار" أو "USD" والأرقام القريبة منها
  if (text.includes('دولار') || text.includes('USD') || text.includes('usd')) {
    console.log('تم العثور على كلمة دولار في النص');
    
    // 1. نمط الرقم مع دولار (3,026.58 دولار)
    const dollarPattern = /(\d{1,4})[,.](\d{1,3})(?:[.,](\d{1,2}))?[\s]*(?:دولار|USD|usd)/i;
    let matches = text.match(dollarPattern);
    
    if (matches) {
      let price = parseFloat(matches[1].replace(',', '') + '.' + matches[2]);
      if (!isNaN(price) && price > 500 && price < 5000) {
        console.log('تم استخراج السعر بنجاح (من قرب كلمة دولار):', price);
        return price;
      }
    }
    
    // 2. البحث عن أرقام قريبة من كلمة دولار
    const nearDollarText = text.replace(/\s+/g, ' ');
    const dollarIndex = Math.max(
      nearDollarText.indexOf('دولار'),
      nearDollarText.indexOf('USD'),
      nearDollarText.indexOf('usd')
    );
    
    if (dollarIndex > 0) {
      // استخراج نص قبل كلمة دولار بـ 20 حرف
      const textBeforeDollar = nearDollarText.substring(Math.max(0, dollarIndex - 20), dollarIndex);
      // البحث عن أرقام في هذا النص
      const numMatches = textBeforeDollar.match(/\d[\d,.]+/g);
      
      if (numMatches && numMatches.length > 0) {
        // استخدام آخر رقم قبل كلمة دولار
        const lastNum = numMatches[numMatches.length - 1].replace(/,/g, '');
        const price = parseFloat(lastNum);
        
        if (!isNaN(price) && price > 500 && price < 5000) {
          console.log('تم استخراج السعر من النص قبل كلمة دولار:', price);
          return price;
        }
      }
    }
  }
  
  // محاولة 1: البحث عن رقم يبدأ بـ 3 ومتبوع بأرقام أخرى (لتغطية أسعار الذهب الحالية حول 3000+)
  const threeThousandPattern = /\b3\d{3}([.,]\d{1,3})?\b/g;
  const threeKMatches = text.match(threeThousandPattern);
  
  if (threeKMatches && threeKMatches.length > 0) {
    for (const match of threeKMatches) {
      const priceText = match.replace(',', '.');
      const price = parseFloat(priceText);
      
      if (!isNaN(price) && price > 2000 && price < 4000) {
        console.log('تم استخراج سعر في نطاق 3000:', price);
        return price;
      }
    }
  }
  
  // محاولة 2: البحث عن أنماط الأرقام بالآلاف مع فاصلة أو نقطة لفصل الآلاف
  const pricePattern = /(\d{1,1})[,.](\d{3})[.,]?(\d{0,3})\b/g;
  const matches = text.match(pricePattern);
  
  console.log('الأرقام المطابقة للنمط:', matches);
  
  if (matches && matches.length > 0) {
    // التحقق من كل مطابقة محتملة
    for (const match of matches) {
      // تنظيف النص بحذف الفواصل وترك النقطة العشرية الأخيرة فقط
      const normalizedText = match.replace(/,/g, '');
      const price = parseFloat(normalizedText);
      
      // التحقق من أن السعر في النطاق المتوقع للذهب
      if (!isNaN(price) && price > 0) {
        if (price > 2000 && price < 4000) {
          console.log('تم استخراج السعر بنجاح:', price);
          return price;
        }
      }
    }
  }
  
  // محاولة للبحث عن أي 4 أرقام متتالية (مثل 3026)
  const fourDigitPattern = /\b(\d{4})\b/g;
  const fourDigitMatches = text.match(fourDigitPattern);
  
  if (fourDigitMatches && fourDigitMatches.length > 0) {
    for (const match of fourDigitMatches) {
      const price = parseInt(match, 10);
      if (price > 2000 && price < 4000) {
        console.log('تم استخراج سعر من رقم مكون من 4 خانات:', price);
        return price;
      }
    }
  }
  
  // البحث عن أنماط أخرى في النص الأصلي
  const digitsPattern = /(\d{1,4})[.,](\d{1,3})/g;
  let match;
  const possiblePrices = [];
  
  while ((match = digitsPattern.exec(text)) !== null) {
    const wholePart = match[1];
    const decimalPart = match[2];
    const formattedPrice = parseFloat(`${wholePart}.${decimalPart}`);
    
    if (!isNaN(formattedPrice) && formattedPrice > 0) {
      if (formattedPrice > 2000 && formattedPrice < 4000) {
        possiblePrices.push(formattedPrice);
      }
    }
  }
  
  console.log('الأسعار المحتملة من النمط البديل:', possiblePrices);
  
  if (possiblePrices.length > 0) {
    // اختيار السعر الأكثر منطقية (عادةً أول سعر تم العثور عليه)
    return possiblePrices[0];
  }
  
  // استخراج أي رقم يقع ضمن نطاق مقبول
  const allNumberPattern = /\b\d+(?:[.,]\d+)?\b/g;
  const allNumbers = [];
  
  while ((match = allNumberPattern.exec(text)) !== null) {
    const numText = match[0].replace(',', '.');
    const num = parseFloat(numText);
    
    if (!isNaN(num)) {
      allNumbers.push(num);
    }
  }
  
  for (const num of allNumbers) {
    if (num > 2000 && num < 4000) {
      console.log('تم استخراج سعر محتمل من الأرقام العامة:', num);
      return num;
    }
  }
  
  console.log('فشل في استخراج السعر من النص وفق التنسيق المطلوب');
  return null;
};
