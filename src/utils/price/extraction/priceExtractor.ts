
/**
 * استخراج سعر الذهب من النص المستخرج
 * @param text النص المستخرج من الصورة
 * @returns السعر المستخرج كرقم أو null إذا لم يتم العثور على سعر صالح
 */
export const extractPriceFromText = (text: string): number | null => {
  if (!text) return null;
  
  console.log("استخراج السعر من النص:", text);
  
  // نمط لاستخراج سعر الذهب (مثلاً 2,345.67 أو 3045.12)
  // يجب أن يبدأ بـ 2 أو 3 (أسعار الذهب عادةً بين 2000-3999)
  
  // نمط 1: مع فاصلة مثل 3,065.48
  const pattern1 = /\b([23]),(\d{3})\.(\d{1,2})\b/;
  const match1 = text.match(pattern1);
  if (match1) {
    const price = parseFloat(`${match1[1]}${match1[2]}.${match1[3]}`);
    console.log("تم استخراج السعر بنمط الفاصلة:", price);
    if (!isNaN(price) && price > 2000 && price < 4000) {
      return price;
    }
  }
  
  // نمط 2: بدون فاصلة مثل 3065.48
  const pattern2 = /\b([23]\d{3})\.(\d{1,2})\b/;
  const match2 = text.match(pattern2);
  if (match2) {
    const price = parseFloat(`${match2[1]}.${match2[2]}`);
    console.log("تم استخراج السعر بنمط بدون فاصلة:", price);
    if (!isNaN(price) && price > 2000 && price < 4000) {
      return price;
    }
  }
  
  // نمط 3: محاولة التعامل مع نص متفرق
  const digitsOnly = text.replace(/[^\d\.]/g, ' ').split(' ').filter(Boolean);
  console.log("الأرقام المستخرجة:", digitsOnly);
  
  for (const digit of digitsOnly) {
    if (digit.includes('.')) {
      const numVal = parseFloat(digit);
      if (!isNaN(numVal)) {
        // التعامل مع أعداد مثل 3.06 (قد تكون 3065)
        if (numVal > 2 && numVal < 4 && digit.split('.')[1].length === 2) {
          const price = numVal * 1000;
          console.log("تم العثور على سعر محتمل بنمط القيمة المنخفضة:", numVal, "-> تعديله إلى", price);
          return price;
        }
        
        // التعامل مع الأعداد العادية
        if (numVal > 2000 && numVal < 4000) {
          console.log("تم العثور على سعر محتمل بنمط الأرقام فقط:", numVal);
          return numVal;
        }
      }
    }
  }
  
  // ابحث عن أي أرقام بين 2000 و 4000
  const allNumbers = text.match(/\d+(\.\d+)?/g);
  if (allNumbers) {
    console.log("كل الأرقام الموجودة في النص:", allNumbers);
    for (const num of allNumbers) {
      const parsedNum = parseFloat(num);
      if (!isNaN(parsedNum) && parsedNum > 2000 && parsedNum < 4000) {
        console.log("تم العثور على رقم يمكن أن يكون سعر الذهب:", parsedNum);
        return parsedNum;
      }
    }
  }
  
  console.log("لم يتم العثور على سعر صالح في النص");
  return null;
};
