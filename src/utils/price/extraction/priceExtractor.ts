
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
  
  // ابحث عن أي رقم يبدأ بـ 3 متبوعًا بأرقام
  // هذا لتحسين استخراج أسعار الذهب الحالية التي تتراوح حول 3000+
  const goldPattern = /\b3\d{3}([.,]\d{1,3})?\b/g;
  const goldMatches = text.match(goldPattern);
  
  if (goldMatches && goldMatches.length > 0) {
    for (const match of goldMatches) {
      // تنظيف المطابقة للحصول على سعر صالح
      const cleanMatch = match.replace(/[^\d.,]/g, '').replace(/,/g, '.');
      let price = parseFloat(cleanMatch);
      
      if (!isNaN(price) && price > 2500 && price < 4000) {
        console.log('تم العثور على سعر ذهب في النطاق 3000:', price);
        return price;
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
      if (!isNaN(price) && price > 2500 && price < 4000) {
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
        
        if (!isNaN(price) && price > 2500 && price < 4000) {
          console.log('تم استخراج السعر من النص قبل كلمة دولار:', price);
          return price;
        }
      }
    }
  }
  
  // محاولة بديلة للعثور على أرقام تشبه سعر الذهب الحالي (حول 3000)
  const threeThousandPatternAlt = /\b30\d{2}([.,]\d{1,2})?\b/g;
  const threeKMatchesAlt = text.match(threeThousandPatternAlt);
  
  if (threeKMatchesAlt && threeKMatchesAlt.length > 0) {
    for (const match of threeKMatchesAlt) {
      const priceText = match.replace(',', '.');
      const price = parseFloat(priceText);
      
      if (!isNaN(price) && price > 2500 && price < 4000) {
        console.log('تم استخراج سعر في نطاق 3000 (نمط بديل):', price);
        return price;
      }
    }
  }
  
  // البحث عن أنماط الأرقام بالآلاف مع فاصلة أو نقطة لفصل الآلاف
  const pricePattern = /(\d{1,1})[,.](\d{3})[.,]?(\d{0,3})\b/g;
  const matches = text.match(pricePattern);
  
  console.log('الأرقام المطابقة للنمط:', matches);
  
  if (matches && matches.length > 0) {
    // التحقق من كل مطابقة محتملة
    for (const match of matches) {
      // تنظيف النص بحذف الفواصل وترك النقطة العشرية الأخيرة فقط
      const normalizedText = match.replace(/,/g, '');
      const price = parseFloat(normalizedText);
      
      // التحقق من أن السعر في النطاق المتوقع للذهب حاليًا
      if (!isNaN(price) && price > 2500 && price < 4000) {
        console.log('تم استخراج السعر بنجاح من نمط الآلاف:', price);
        return price;
      }
    }
  }
  
  // البحث عن أي 4 أرقام متتالية في نطاق سعر الذهب الحالي
  const fourDigitPattern = /\b(3\d{3})\b/g;
  const fourDigitMatches = text.match(fourDigitPattern);
  
  if (fourDigitMatches && fourDigitMatches.length > 0) {
    for (const match of fourDigitMatches) {
      const price = parseInt(match, 10);
      if (price > 2500 && price < 4000) {
        console.log('تم استخراج سعر من رقم مكون من 4 خانات:', price);
        return price;
      }
    }
  }
  
  // محاولة أخيرة للعثور على أرقام تبدأ بـ 3 في أي مكان في النص
  const anyThreePattern = /\b3\d+([.,]\d+)?\b/g;
  const anyThreeMatches = text.match(anyThreePattern);
  
  if (anyThreeMatches && anyThreeMatches.length > 0) {
    for (const match of anyThreeMatches) {
      const cleanMatch = match.replace(/,/g, '.');
      const price = parseFloat(cleanMatch);
      
      // تحقق مما إذا كان الرقم في نطاق 3000 (سعر الذهب الحالي)
      if (!isNaN(price)) {
        if (price > 2500 && price < 4000) {
          console.log('تم استخراج سعر من نمط أي رقم يبدأ بـ 3:', price);
          return price;
        } else if (price > 3 && price < 4) {
          // قد يكون التنسيق 3.02 بدلاً من 3020
          const adjustedPrice = price * 1000;
          if (adjustedPrice > 2500 && adjustedPrice < 4000) {
            console.log('تم تعديل السعر من', price, 'إلى', adjustedPrice);
            return adjustedPrice;
          }
        }
      }
    }
  }
  
  console.log('فشل في استخراج السعر من النص وفق التنسيق المطلوب');
  return null;
};
