
/**
 * Gets the last stored price from the database as fallback
 */
export async function getLastStoredPrice(supabase: any): Promise<number | null> {
  try {
    console.log('Trying to get last stored price from database as fallback');
    
    const { data: lastPriceData, error: lastPriceError } = await supabase
      .from('search_history')
      .select('last_checked_price')
      .is('last_checked_price', 'not.null')
      .order('last_checked_at', { ascending: false })
      .limit(1);
    
    if (!lastPriceError && lastPriceData?.length > 0) {
      console.log('Using last stored price:', lastPriceData[0].last_checked_price);
      return lastPriceData[0].last_checked_price;
    } else {
      if (lastPriceError) {
        console.error('Database error when retrieving last price:', lastPriceError);
      } else {
        console.warn('No previous price records found in database');
      }
      console.warn('Could not retrieve last stored price, returning null');
      // لا نستخدم قيمة افتراضية الآن
      return null;
    }
  } catch (lastPriceErr) {
    console.error('Exception in getLastStoredPrice:', lastPriceErr);
    // لا نستخدم قيمة افتراضية
    return null;
  }
}

/**
 * Gets the current price either from the request or fallback methods
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
      
      console.log('No valid price in request, falling back to last stored price');
      
      // استخدام آخر سعر محفوظ كخطة بديلة
      try {
        const lastPrice = await getLastStoredPrice(supabase);
        console.log('Retrieved fallback price:', lastPrice);
        resolve(lastPrice);
      } catch (err) {
        console.error('Failed to get last stored price, using null:', err);
        resolve(null);
      }
    } catch (err) {
      console.error('Exception in getEffectivePrice:', err);
      resolve(null);
    }
  });
}
