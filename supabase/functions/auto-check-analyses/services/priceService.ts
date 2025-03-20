
// import { fetchPrice } from '../../../utils/price/api/index.ts';
// Edge functions cannot import from outside their directory
// We need to implement price fetching directly here

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
      
      // جلب السعر للرمز المحدد
      const symbol = requestData?.symbol || 'XAUUSD';
      
      // استخدام السعر المخزن في قاعدة البيانات
      try {
        const price = await getLastStoredPrice(supabase, symbol);
        if (price !== null) {
          console.log(`استخدام السعر المخزن للرمز ${symbol}: ${price}`);
          resolve(price);
          return;
        }
      } catch (err) {
        console.error('خطأ في جلب السعر المخزن:', err);
      }

      // استخدام سعر افتراضي إذا فشلت كل المحاولات
      console.log('لم يتم العثور على سعر، استخدام سعر افتراضي');
      resolve(null);
    } catch (err) {
      console.error('خطأ في getEffectivePrice:', err);
      resolve(null);
    }
  });
}

/**
 * جلب آخر سعر مخزن للرمز
 */
export async function getLastStoredPrice(supabase: any, symbol: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('real_time_prices')
      .select('price, updated_at')
      .eq('symbol', symbol)
      .single();
    
    if (error || !data) {
      console.log(`لم يتم العثور على سعر مخزن للرمز ${symbol}`);
      return null;
    }
    
    console.log(`تم العثور على سعر مخزن للرمز ${symbol}: ${data.price}`);
    return data.price;
  } catch (error) {
    console.error(`خطأ في جلب السعر المخزن للرمز ${symbol}:`, error);
    return null;
  }
}
