
/**
 * استخراج السعر من النص المستخرج من الصورة
 * @param text النص المستخرج من الصورة
 * @returns السعر المستخرج أو null إذا لم يتم العثور على سعر
 */
export const extractPriceFromText = (text: string): number | null => {
  console.log('النص المستخرج من الصورة:', text);
  
  // البحث عن نمط الأرقام ذات 4 خانات و3 فواصل عشرية (مثل 2134.567)
  const pricePattern = /\b\d{1,4}[.,]\d{1,3}\b/g;
  const matches = text.match(pricePattern);
  
  console.log('الأرقام المطابقة المستخرجة:', matches);
  
  if (matches && matches.length > 0) {
    // أخذ أول رقم مطابق
    const priceText = matches[0].replace(',', '.');
    const price = parseFloat(priceText);
    
    if (!isNaN(price) && price > 0) {
      console.log('تم استخراج السعر بنجاح:', price);
      return price;
    }
  }
  
  // محاولة بديلة للبحث عن أي رقم في النص
  const anyNumberPattern = /\d+[.,]\d+/g;
  const anyMatches = text.match(anyNumberPattern);
  
  if (anyMatches && anyMatches.length > 0) {
    // ترتيب الأرقام حسب الطول (الأطول أولاً) للعثور على الرقم الأكثر احتمالاً
    const sortedMatches = [...anyMatches].sort((a, b) => b.length - a.length);
    const priceText = sortedMatches[0].replace(',', '.');
    const price = parseFloat(priceText);
    
    if (!isNaN(price) && price > 0) {
      console.log('تم استخراج السعر باستخدام الطريقة البديلة:', price);
      return price;
    }
  }
  
  console.log('فشل في استخراج السعر من النص');
  return null;
};
