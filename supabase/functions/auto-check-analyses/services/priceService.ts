
/**
 * Gets the current price from the request
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // محاولة استخدام السعر من الطلب
      const tradingViewPrice = requestData?.currentPrice || null;
      
      if (tradingViewPrice !== null && !isNaN(tradingViewPrice)) {
        console.log('Using price from request:', tradingViewPrice);
        resolve(tradingViewPrice);
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
