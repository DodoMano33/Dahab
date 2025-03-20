
/**
 * جلب السعر الحالي - تم حذف المصدر السابق
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // استخدام السعر من الطلب إذا كان متوفرًا
      const providedPrice = requestData?.currentPrice || null;
      
      if (providedPrice !== null && !isNaN(providedPrice)) {
        console.log('استخدام السعر المقدم من الطلب:', providedPrice);
        resolve(providedPrice);
        return;
      }
      
      console.log('تم حذف مصدر السعر السابق، يجب استخدام المصدر الجديد');
      resolve(null);
    } catch (err) {
      console.error('خطأ في getEffectivePrice:', err);
      resolve(null);
    }
  });
}

/**
 * جلب آخر سعر مخزن للرمز - تم حذف المصدر السابق
 */
export async function getLastStoredPrice(supabase: any, symbol: string): Promise<number | null> {
  console.log('تم حذف وظيفة جلب آخر سعر مخزن للرمز وتحتاج إلى تنفيذ المصدر الجديد');
  return null;
}
