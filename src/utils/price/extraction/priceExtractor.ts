
/**
 * استخراج السعر من النص المستخرج من الصورة
 * @param text النص المستخرج من الصورة
 * @returns السعر المستخرج أو null إذا لم يتم العثور على سعر
 */
export const extractPriceFromText = (text: string): number | null => {
  console.log('النص المستخرج من الصورة:', text);
  
  // البحث عن نمط الأرقام المكونة من 4 خانات أساسية بالضبط و3 خانات عشرية بالضبط
  // مثال: 1234.567 أو 2345.678
  const pricePattern = /\b\d{4}\.\d{3}\b/g;
  const matches = text.match(pricePattern);
  
  console.log('الأرقام المطابقة للنمط الدقيق (4 أرقام + 3 أرقام عشرية):', matches);
  
  if (matches && matches.length > 0) {
    // أخذ أول رقم مطابق
    const priceText = matches[0];
    const price = parseFloat(priceText);
    
    if (!isNaN(price) && price > 0) {
      console.log('تم استخراج السعر بنجاح:', price);
      return price;
    }
  }
  
  // محاولة بديلة للعثور على أرقام قد تكون بتنسيق مختلف قليلاً لكن تحتوي على 4 أرقام قبل النقطة و3 بعدها
  // مثلاً قد تكون مفصولة بفواصل أو مساحات
  const alternativePattern = /\b(\d{1,4})[.,](\d{3})\b/g;
  let alternativeMatches: RegExpExecArray | null;
  let validMatches: string[] = [];
  
  while ((alternativeMatches = alternativePattern.exec(text)) !== null) {
    // التحقق من أن الجزء الأول يحتوي على 4 أرقام بالضبط (قد يكون هناك أصفار في البداية)
    const wholePart = alternativeMatches[1].padStart(4, '0');
    if (wholePart.length === 4) {
      const fractionPart = alternativeMatches[2];
      if (fractionPart.length === 3) {
        validMatches.push(`${wholePart}.${fractionPart}`);
      }
    }
  }
  
  console.log('الأرقام المطابقة للتنسيق البديل:', validMatches);
  
  if (validMatches.length > 0) {
    const priceText = validMatches[0];
    const price = parseFloat(priceText);
    
    if (!isNaN(price) && price > 0) {
      console.log('تم استخراج السعر باستخدام التنسيق البديل:', price);
      return price;
    }
  }
  
  // محاولة أخيرة: البحث عن أي رقم ثم تحويله للتنسيق المطلوب
  const anyNumberPattern = /(\d+)[.,](\d+)/g;
  let anyMatches: RegExpExecArray | null;
  let anyValidMatches: string[] = [];
  
  while ((anyMatches = anyNumberPattern.exec(text)) !== null) {
    const wholePart = anyMatches[1];
    const fractionPart = anyMatches[2];
    
    // إذا كان الجزء الصحيح أكبر من 4 أرقام، نأخذ آخر 4 أرقام فقط
    const formattedWholePart = wholePart.length > 4 
      ? wholePart.slice(-4) 
      : wholePart.padStart(4, '0');
    
    // إذا كان الجزء العشري أكبر من 3 أرقام، نأخذ أول 3 أرقام فقط
    const formattedFractionPart = fractionPart.length >= 3 
      ? fractionPart.slice(0, 3) 
      : fractionPart.padEnd(3, '0');
    
    if (formattedWholePart.length === 4 && formattedFractionPart.length === 3) {
      anyValidMatches.push(`${formattedWholePart}.${formattedFractionPart}`);
    }
  }
  
  console.log('الأرقام التي تم تنسيقها للمطابقة:', anyValidMatches);
  
  if (anyValidMatches.length > 0) {
    // ترتيب الأرقام بناءً على تشابهها مع التنسيق المطلوب
    const priceText = anyValidMatches[0];
    const price = parseFloat(priceText);
    
    if (!isNaN(price) && price > 0) {
      console.log('تم استخراج السعر وتنسيقه للمطابقة:', price);
      return price;
    }
  }
  
  console.log('فشل في استخراج السعر من النص وفق التنسيق المطلوب');
  return null;
};
