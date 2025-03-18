
/**
 * استخدام سعر الصورة فقط
 */
export async function getLastStoredPrice(supabase: any): Promise<number> {
  // سنستخدم قيمة افتراضية لأننا الآن نعتمد فقط على استخراج السعر من الصورة
  console.log('استخدام قيمة افتراضية لسعر الذهب لأننا نعتمد فقط على السعر من الصورة');
  return 0; // قيمة افتراضية 0 تشير إلى أننا نعتمد على السعر من الصورة فقط
}

/**
 * الحصول على السعر المستخرج من الصورة فقط
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // التحقق من وجود سعر من الصورة في طلب الـ API
      const imagePrice = requestData?.currentPrice || null;
      
      if (imagePrice !== null && !isNaN(imagePrice)) {
        console.log('استخدام السعر المستخرج من الصورة فقط:', imagePrice);
        resolve(imagePrice);
        return;
      }
      
      // إذا لم يكن هناك سعر من الصورة، أرجع null
      console.log('لا يوجد سعر مستخرج من الصورة، لا يمكن متابعة العملية');
      resolve(null);
    } catch (err) {
      console.error('خطأ في getEffectivePrice:', err);
      resolve(null);
    }
  });
}
