
/**
 * نسخة مبسطة تستخدم قيمة ثابتة بدلاً من أسعار السوق
 */
export async function getLastStoredPrice(supabase: any): Promise<number> {
  // قيمة ثابتة بدلاً من السعر الحقيقي
  console.log('استخدام قيمة ثابتة بدلاً من سعر السوق');
  return 100; // قيمة ثابتة
}

/**
 * الحصول على قيمة ثابتة للتحليل
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      console.log('استخدام قيمة ثابتة بدلاً من سعر الشارت');
      resolve(100);
    } catch (err) {
      console.error('خطأ في getEffectivePrice:', err);
      resolve(100);
    }
  });
}
