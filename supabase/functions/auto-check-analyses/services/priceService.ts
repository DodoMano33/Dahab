
/**
 * Gets the current price from Metal Price API
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // استخدام السعر من الطلب
      const providedPrice = requestData?.currentPrice || null;
      
      if (providedPrice !== null && !isNaN(providedPrice)) {
        console.log('Using provided price from request:', providedPrice);
        resolve(providedPrice);
        return;
      }
      
      console.log('No valid price in request, returning null');
      resolve(null);
    } catch (err) {
      console.error('Exception in getEffectivePrice:', err);
      resolve(null);
    }
  });
}
