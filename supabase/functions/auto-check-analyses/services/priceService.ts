
/**
 * جلب السعر الحالي
 */
export async function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // استخدام السعر من الطلب إذا كان متوفرًا
      const providedPrice = requestData?.currentPrice || null;
      
      if (providedPrice !== null && !isNaN(providedPrice)) {
        console.log('استخدام السعر المقدم من الطلب:', providedPrice);
        resolve(providedPrice);
        return;
      }
      
      // جلب فقط سعر الذهب (XAUUSD)
      const symbol = 'XAUUSD'; // استخدام XAUUSD دائمًا بغض النظر عن الطلب
      
      // استخدام السعر المخزن في قاعدة البيانات
      try {
        const price = await getLastStoredPrice(supabase, symbol);
        if (price !== null) {
          console.log(`استخدام سعر الذهب المخزن: ${price}`);
          resolve(price);
          return;
        }
      } catch (err) {
        console.error('خطأ في جلب سعر الذهب المخزن:', err);
      }

      // استخدام سعر افتراضي إذا فشلت كل المحاولات
      console.log('لم يتم العثور على سعر الذهب، استخدام سعر افتراضي');
      resolve(null);
    } catch (err) {
      console.error('خطأ في getEffectivePrice:', err);
      resolve(null);
    }
  });
}

/**
 * جلب آخر سعر مخزن للذهب
 */
export async function getLastStoredPrice(supabase: any, symbol: string): Promise<number | null> {
  try {
    // استخدام XAUUSD دائمًا
    const { data, error } = await supabase
      .from('real_time_prices')
      .select('price, updated_at')
      .eq('symbol', 'XAUUSD')
      .single();
    
    if (error || !data) {
      console.log('لم يتم العثور على سعر الذهب المخزن');
      return null;
    }
    
    console.log(`تم العثور على سعر الذهب المخزن: ${data.price}`);
    return data.price;
  } catch (error) {
    console.error('خطأ في جلب سعر الذهب المخزن:', error);
    return null;
  }
}
