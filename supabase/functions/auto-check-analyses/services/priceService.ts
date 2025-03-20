
/**
 * Gets the current price from Metal Price API
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // استخدام السعر من الطلب إذا كان متوفرًا
      const providedPrice = requestData?.currentPrice || null;
      
      if (providedPrice !== null && !isNaN(providedPrice)) {
        console.log('Using provided price from request:', providedPrice);
        resolve(providedPrice);
        return;
      }
      
      // إذا لم يكن السعر متوفرًا في الطلب، نقوم بإرجاع null
      console.log('No valid price in request. Returning null');
      resolve(null);
    } catch (err) {
      console.error('Exception in getEffectivePrice:', err);
      resolve(null);
    }
  });
}

/**
 * Gets the last stored price for a symbol - وظيفة الدعم فقط
 */
export async function getLastStoredPrice(supabase: any, symbol: string): Promise<number | null> {
  // نقوم بإرجاع null لأننا نستخدم Metal Price API فقط
  console.log('getLastStoredPrice called but bypassed as we use Metal Price API only');
  return null;
}
