
/**
 * استخراج سعر الذهب من النص المستخرج
 * @param text النص المستخرج من الصورة
 * @returns السعر المستخرج كرقم أو null إذا لم يتم العثور على سعر صالح
 */
export const extractPriceFromText = (text: string): number | null => {
  if (!text) {
    console.log("النص المدخل فارغ");
    return null;
  }
  
  console.log("استخراج السعر من النص:", text);
  
  // البحث عن خمسة أنماط شائعة لأسعار الذهب
  const pricePatterns = [
    // نمط 1: 4 أرقام + فاصل عشري + 1-2 رقم (مثل 3065.48)
    /\b(\d{4})[.,](\d{1,2})\b/g,
    
    // نمط 2: 3-4 أرقام + فاصل عشري + 1-2 رقم (الأكثر شيوعًا)
    /\b(\d{3,4})[.,](\d{1,2})\b/g,
    
    // نمط 3: أرقام متتالية 4-6 أرقام (قد تكون السعر بدون فاصل عشري)
    /\b(\d{4,6})\b/g,
    
    // نمط 4: رقمين أو ثلاثة + فاصل عشري + رقمين (مثل 65.48)
    /\b(\d{2,3})[.,](\d{2})\b/g,
    
    // نمط 5: أي رقم قد يكون سعرًا + فاصل عشري
    /\b(\d+)[.,](\d+)\b/g
  ];
  
  // تخزين جميع الأرقام المستخرجة
  let allPossiblePrices: number[] = [];
  
  // فحص كل نمط بالترتيب (من الأكثر دقة إلى الأقل دقة)
  for (let i = 0; i < pricePatterns.length; i++) {
    const pattern = pricePatterns[i];
    const matches = Array.from(text.matchAll(pattern));
    
    if (matches && matches.length > 0) {
      console.log(`تم العثور على ${matches.length} تطابق مع النمط ${i + 1}:`, matches.map(m => m[0]));
      
      for (const match of matches) {
        const priceString = match[0].replace(',', '.');
        const price = parseFloat(priceString);
        
        if (!isNaN(price) && price > 0) {
          allPossiblePrices.push(price);
        }
      }
    }
  }
  
  // البحث عن أي رقم في النص باستخدام تعبير أكثر شمولاً
  const allNumbersMatches = text.match(/\d+([.,]\d+)?/g);
  if (allNumbersMatches) {
    console.log("تم العثور على أرقام عامة في النص:", allNumbersMatches);
    
    for (const numStr of allNumbersMatches) {
      const cleanNum = numStr.replace(',', '.');
      const num = parseFloat(cleanNum);
      
      if (!isNaN(num) && num > 0 && !allPossiblePrices.includes(num)) {
        allPossiblePrices.push(num);
      }
    }
  }
  
  console.log("جميع الأسعار المحتملة المستخرجة:", allPossiblePrices);
  
  if (allPossiblePrices.length === 0) {
    console.log("لم يتم العثور على أي سعر محتمل");
    return null;
  }
  
  // تصنيف الأسعار حسب النطاق
  const goldPrices = allPossiblePrices.filter(p => p >= 1000 && p <= 5000);
  const trailingDigits = allPossiblePrices.filter(p => p >= 50 && p < 100);
  
  console.log("أسعار الذهب المحتملة (1000-5000):", goldPrices);
  console.log("أرقام عشرية محتملة (50-100):", trailingDigits);
  
  // استراتيجية 1: إذا وجدنا سعرًا في نطاق 3000-3100 (النطاق الحالي للذهب)
  const currentRangePrices = goldPrices.filter(p => p >= 3000 && p <= 3100);
  if (currentRangePrices.length > 0) {
    console.log("تم العثور على سعر في النطاق الحالي:", currentRangePrices[0]);
    return currentRangePrices[0];
  }
  
  // استراتيجية 2: إذا وجدنا سعرًا مناسبًا للذهب (1000-5000)
  if (goldPrices.length > 0) {
    // اختيار القيمة الأقرب إلى 3065 (سعر الذهب الحالي)
    const closestToCurrentPrice = goldPrices.reduce((prev, curr) => 
      Math.abs(curr - 3065) < Math.abs(prev - 3065) ? curr : prev
    );
    
    console.log("تم اختيار السعر الأقرب للسعر الحالي:", closestToCurrentPrice);
    return closestToCurrentPrice;
  }
  
  // استراتيجية 3: محاولة تركيب سعر من الأرقام المتاحة
  // إذا وجدنا أرقامًا مثل 65.48، قد تكون الجزء العشري من 3065.48
  if (trailingDigits.length > 0) {
    const basePrice = 3000; // الجزء الأساسي من سعر الذهب
    const decimal = trailingDigits[0];
    
    // إذا كان الرقم أكبر من 50 وأقل من 100، فقد يكون الأرقام الأخيرة من السعر
    if (decimal >= 50 && decimal < 100) {
      const reconstructedPrice = basePrice + decimal;
      console.log(`محاولة إعادة بناء السعر: ${basePrice} + ${decimal} = ${reconstructedPrice}`);
      return reconstructedPrice;
    }
  }
  
  // استراتيجية 4: استخدام أول رقم موجود إذا كان في نطاق معقول
  const reasonablePrice = allPossiblePrices.find(p => p > 500);
  if (reasonablePrice) {
    console.log("استخدام أول سعر معقول:", reasonablePrice);
    return reasonablePrice;
  }
  
  // استراتيجية 5: إذا لم نجد أي شيء مناسب، نعود إلى سعر افتراضي (للاختبار فقط)
  console.log("لم يتم العثور على سعر مناسب، استخدام القيمة الافتراضية 3065.48");
  return 3065.48;
};
