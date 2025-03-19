
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
      
      // تحقق من وجود رمز في الطلب
      const symbol = requestData?.symbol || 'XAUUSD';
      console.log(`No valid price in request. Symbol from request: ${symbol}`);
      
      try {
        // يمكن اضافة دالة هنا لجلب السعر من API مباشرة
        // لكن يفضل استخدام السعر المقدم من الواجهة الأمامية لتجنب تجاوز حد معدل الاستخدام
      } catch (priceError) {
        console.error('Error fetching price:', priceError);
      }
      
      // إرجاع قيمة null إذا لم يتم العثور على سعر
      console.log('No valid price available, returning null');
      resolve(null);
    } catch (err) {
      console.error('Exception in getEffectivePrice:', err);
      resolve(null);
    }
  });
}

/**
 * Gets the last stored price for a symbol
 */
export async function getLastStoredPrice(supabase: any, symbol: string): Promise<number | null> {
  try {
    // محاولة الحصول على آخر سعر مخزن للرمز المحدد
    const { data, error } = await supabase
      .from('search_history')
      .select('last_checked_price')
      .eq('symbol', symbol)
      .order('last_checked_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.log(`No stored price found for symbol ${symbol}`);
      return null;
    }
    
    const lastPrice = data[0]?.last_checked_price;
    if (lastPrice !== null && !isNaN(lastPrice)) {
      console.log(`Found last stored price for symbol ${symbol}: ${lastPrice}`);
      return lastPrice;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting last stored price:', error);
    return null;
  }
}
