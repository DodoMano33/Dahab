
/**
 * استخراج سعر الذهب من النص المستخرج
 * @param text النص المستخرج من الصورة
 * @returns السعر المستخرج كرقم أو null إذا لم يتم العثور على سعر صالح
 */
export const extractPriceFromText = (text: string): number | null => {
  if (!text) return null;
  
  console.log("استخراج السعر من النص:", text);
  
  // البحث عن أنماط محددة مثل 3028.9 (4 أرقام + نقطة عشرية + 1-2 أرقام)
  const specificPatterns = text.match(/\b(\d{4})[.,](\d{1,2})\b/g);
  if (specificPatterns && specificPatterns.length > 0) {
    console.log("تم العثور على أنماط سعر محددة:", specificPatterns);
    
    // تحويل كافة الأنماط إلى أرقام
    const prices = specificPatterns.map(pat => parseFloat(pat.replace(',', '.')))
      .filter(num => !isNaN(num))
      .filter(num => num >= 1000 && num <= 9000); // فلترة أسعار الذهب المعقولة
      
    if (prices.length > 0) {
      // ترتيب الأسعار وأخذ المتوسط لأكثر الأسعار تكرارًا
      prices.sort((a, b) => a - b);
      console.log("الأسعار المرتبة:", prices);
      
      // إذا كان هناك سعر في النطاق 3000-3100 (النطاق الحالي)، نأخذه
      const currentRangePrices = prices.filter(p => p >= 3000 && p <= 3100);
      if (currentRangePrices.length > 0) {
        console.log("تم اختيار السعر من النطاق الحالي:", currentRangePrices[0]);
        return currentRangePrices[0];
      }
      
      // خلاف ذلك نأخذ الوسط
      const medianIndex = Math.floor(prices.length / 2);
      console.log("تم اختيار السعر الوسطي:", prices[medianIndex]);
      return prices[medianIndex];
    }
  }
  
  // تنظيف النص وإزالة الأحرف غير الأرقام والأرقام العشرية والفواصل
  const cleanedText = text.replace(/[^\d.,]/g, ' ');
  console.log("النص بعد التنظيف:", cleanedText);
  
  // استخراج جميع الأرقام المحتملة من النص
  const numberPatterns = [
    /\b(\d{4})[.,](\d{1,3})\b/g,  // مثل 3028.9 أو 3028.90
    /\b(\d{3,4})[.,](\d{1,3})\b/g,  // أنماط مثل 028.9 أو 3028.90
    /\b(\d{3,4})[,.](\d{1,3})[,.](\d{1,3})\b/g,  // أنماط مثل 3,028.90
    /\b(\d{3,4})\b/g  // أرقام صحيحة مثل 3028
  ];
  
  let allNumbers: string[] = [];
  
  // استخراج جميع الأنماط الرقمية المحتملة
  for (const pattern of numberPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      if (match && match[0]) {
        // تنظيف الرقم من أي فواصل آلاف
        const cleanNumber = match[0].replace(/,/g, '.');
        if (!allNumbers.includes(cleanNumber)) {
          allNumbers.push(cleanNumber);
        }
      }
    }
  }
  
  // محاولة استخراج أرقام مباشرة باستخدام تعبير منتظم أكثر تحديدًا
  const directMatches = text.match(/\b\d{1,4}[.,]\d{1,3}\b/g);
  if (directMatches) {
    directMatches.forEach(match => {
      const cleanMatch = match.replace(/,/g, '.');
      if (!allNumbers.includes(cleanMatch)) {
        allNumbers.push(cleanMatch);
      }
    });
  }
  
  console.log("جميع الأرقام المستخرجة:", allNumbers);
  
  // تحويل جميع الأرقام المستخرجة إلى أرقام حقيقية وترتيبها
  const prices = allNumbers
    .map(num => {
      // التأكد من أن النقطة العشرية صحيحة
      const normalizedNum = num.replace(/,/g, '.');
      return parseFloat(normalizedNum);
    })
    .filter(num => !isNaN(num))
    .sort((a, b) => b - a);  // ترتيب تنازلي للحصول على أكبر الأرقام أولاً
  
  console.log("الأرقام المستخرجة بعد التحويل والترتيب:", prices);
  
  // إذا وجدنا أرقاماً في النطاق 1000-9000، نعتبرها أسعاراً محتملة للذهب
  const possibleGoldPrices = prices.filter(price => price >= 1000 && price <= 9000);
  if (possibleGoldPrices.length > 0) {
    console.log("أسعار ذهب محتملة:", possibleGoldPrices);
    
    // النظر في القيمة الأقرب إلى 3000 (سعر الذهب الحالي حول 3000)
    const closestTo3000 = possibleGoldPrices.reduce((prev, curr) => 
      Math.abs(curr - 3000) < Math.abs(prev - 3000) ? curr : prev
    );
    
    console.log("السعر الأقرب للقيمة المتوقعة:", closestTo3000);
    return closestTo3000;
  }
  
  // إذا لم نجد أرقاماً في النطاق المتوقع، نحاول العثور على أي أرقام
  if (prices.length > 0) {
    // البحث عن الأرقام التي قد تكون جزءًا من سعر الذهب
    const threeDigitNumbers = prices.filter(price => price >= 100 && price < 1000);
    
    for (const price of threeDigitNumbers) {
      if (price > 0) {
        // قد يكون هذا جزءًا من سعر الذهب (مثلاً "028" من "3028")
        const possibleGoldPrice = 3000 + (price % 100);
        console.log(`محاولة تكوين سعر الذهب من ${price}: ${possibleGoldPrice}`);
        if (possibleGoldPrice >= 3000 && possibleGoldPrice <= 3100) {
          return possibleGoldPrice;
        }
      }
    }
    
    // إذا وصلنا إلى هنا، نأخذ أول رقم موجب
    for (const price of prices) {
      if (price > 0) {
        console.log("أخذ أول رقم موجب:", price);
        return price;
      }
    }
  }
  
  console.log("لم يتم العثور على سعر صالح في النص");
  return null;
};
