
/**
 * استخدام سعر الشارت المباشر فقط
 */
export async function getLastStoredPrice(supabase: any): Promise<number> {
  // سنستخدم قيمة افتراضية لأننا الآن نعتمد فقط على استخراج السعر من الشارت
  console.log('استخدام قيمة افتراضية لسعر الذهب');
  return 2000; // قيمة افتراضية للذهب
}

/**
 * الحصول على السعر المستخرج من الشارت فقط
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // التحقق من وجود سعر من الشارت في طلب الـ API
      const chartPrice = requestData?.currentPrice || null;
      
      if (chartPrice !== null && !isNaN(chartPrice)) {
        console.log('استخدام السعر المستخرج من الشارت:', chartPrice);
        resolve(chartPrice);
        return;
      }
      
      // إذا لم يكن هناك سعر من الشارت، استخدم القيمة الافتراضية
      console.log('لا يوجد سعر مستخرج من الشارت، استخدام القيمة الافتراضية');
      resolve(2000);
    } catch (err) {
      console.error('خطأ في getEffectivePrice:', err);
      resolve(2000);
    }
  });
}
