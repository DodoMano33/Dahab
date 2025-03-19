
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
  
  // استخراج جميع الأرقام المحتملة من النص (أي رقم متبوع بنقطة عشرية وأرقام)
  const numberPatterns = [
    /\b(\d{1,4})[.,](\d{1,3})\b/g,  // أنماط مثل 3028.9 أو 3028.90
    /\b(\d{1,4})[,.](\d{1,3})[,.](\d{1,3})\b/g,  // أنماط مثل 3,028.90
    /\b(\d{1,4})\b/g  // أرقام صحيحة مثل 3028
  ];
  
  let allNumbers: string[] = [];
  
  // استخراج جميع الأنماط الرقمية المحتملة
  for (const pattern of numberPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      allNumbers.push(match[0].replace(/,/g, ''));
    }
  }
  
  console.log("جميع الأرقام المستخرجة:", allNumbers);
  
  // تحويل جميع الأرقام المستخرجة إلى أرقام حقيقية وترتيبها
  const prices = allNumbers
    .map(num => parseFloat(num.replace(/,/g, '.')))
    .filter(num => !isNaN(num))
    .sort((a, b) => b - a);  // ترتيب تنازلي للحصول على أكبر الأرقام أولاً
  
  console.log("الأرقام المستخرجة بعد التحويل والترتيب:", prices);
  
  // البحث عن الرقم الأكثر منطقية كسعر للذهب (بناءً على عدة محاولات)
  
  // المحاولة 1: إذا وجدنا أرقاماً في النطاق 1000-9000، نعتبرها أسعاراً محتملة للذهب
  const possibleGoldPrices = prices.filter(price => price >= 1000 && price <= 9000);
  if (possibleGoldPrices.length > 0) {
    console.log("أسعار ذهب محتملة:", possibleGoldPrices);
    return possibleGoldPrices[0];  // نأخذ أول سعر محتمل (الأكبر)
  }
  
  // المحاولة 2: البحث عن أرقام قد تكون بدون أرقام الآلاف (مثل 28.9 بدلاً من 3028.9)
  const smallNumbers = prices.filter(price => price >= 10 && price <= 99);
  for (const smallNum of smallNumbers) {
    // التحقق مما إذا كان هذا الرقم يمثل جزءاً من السعر (مثل 28.9 من 3028.9)
    if (smallNum > 0 && smallNum < 100) {
      // بافتراض أن الرقم يمثل جزءاً من سعر الذهب في النطاق 3000
      const adjustedPrice = 3000 + smallNum;
      console.log("قد يكون هذا رقماً جزئياً، السعر المعدل:", adjustedPrice);
      if (adjustedPrice >= 1000 && adjustedPrice <= 9000) {
        return adjustedPrice;
      }
    }
  }
  
  // المحاولة 3: البحث عن أرقام مثل 3.xx قد تعني 3xxx
  const tinyNumbers = prices.filter(price => price >= 1 && price < 10);
  for (const tinyNum of tinyNumbers) {
    if (tinyNum >= 1 && tinyNum < 10) {
      // ضرب الرقم في 1000 لتحويله إلى نطاق أسعار الذهب
      const adjustedPrice = tinyNum * 1000;
      console.log("قد يكون هذا رقماً مختصراً، السعر المعدل:", adjustedPrice);
      if (adjustedPrice >= 1000 && adjustedPrice <= 9000) {
        return adjustedPrice;
      }
    }
  }
  
  // المحاولة 4: تجربة استخراج أي رقم بدون قيود صارمة
  if (prices.length > 0) {
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
