
/**
 * استخدام سعر الشارت المباشر وسعر Alpha Vantage
 */
export async function getLastStoredPrice(supabase: any): Promise<number> {
  try {
    // جلب آخر سعر مخزن من قاعدة البيانات
    const { data, error } = await supabase
      .from('gold_prices')
      .select('price')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0 && data[0].price) {
      console.log('استخدام آخر سعر مخزن من قاعدة البيانات:', data[0].price);
      return data[0].price;
    }
    
    // إذا لم نجد سعرًا مخزنًا، استخدم قيمة افتراضية
    console.log('استخدام قيمة افتراضية لسعر الذهب');
    return 2000;
  } catch (err) {
    console.error('خطأ في جلب آخر سعر مخزن:', err);
    return 2000;
  }
}

/**
 * الحصول على السعر الفعال من عدة مصادر
 */
export function getEffectivePrice(requestData: any, supabase: any): Promise<number | null> {
  return new Promise(async (resolve) => {
    try {
      // 1. التحقق من وجود سعر Alpha Vantage في طلب الـ API
      const alphaVantagePrice = requestData?.alphaVantagePrice || null;
      
      // 2. التحقق من وجود سعر من الشارت في طلب الـ API
      const chartPrice = requestData?.currentPrice || null;
      
      // 3. أولوية استخدام سعر Alpha Vantage إذا كان متاحًا
      if (alphaVantagePrice !== null && !isNaN(alphaVantagePrice)) {
        console.log('استخدام سعر Alpha Vantage:', alphaVantagePrice);
        
        // حفظ السعر في قاعدة البيانات للاستخدام المستقبلي
        try {
          await supabase.from('gold_prices').insert({
            price: alphaVantagePrice,
            source: 'alpha_vantage'
          });
        } catch (saveErr) {
          console.error('خطأ في حفظ سعر Alpha Vantage:', saveErr);
        }
        
        resolve(alphaVantagePrice);
        return;
      }
      
      // 4. استخدام سعر الشارت إذا كان متاحًا
      if (chartPrice !== null && !isNaN(chartPrice)) {
        console.log('استخدام السعر المستخرج من الشارت:', chartPrice);
        resolve(chartPrice);
        return;
      }
      
      // 5. إذا لم تكن هناك أسعار متاحة، استخدم آخر سعر مخزن
      const lastStoredPrice = await getLastStoredPrice(supabase);
      console.log('استخدام آخر سعر مخزن:', lastStoredPrice);
      resolve(lastStoredPrice);
    } catch (err) {
      console.error('خطأ في getEffectivePrice:', err);
      resolve(2000);
    }
  });
}
