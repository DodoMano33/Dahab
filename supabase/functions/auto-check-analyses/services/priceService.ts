
/**
 * Gets the last stored price from the database as fallback
 */
export async function getLastStoredPrice(supabase: any): Promise<number> {
  try {
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
      console.warn('Could not retrieve last stored price, using default');
      // استخدام قيمة افتراضية معقولة في أسوأ الحالات
      return 2000; // قيمة افتراضية للذهب
    }
  } catch (lastPriceErr) {
    console.error('Error fetching last stored price:', lastPriceErr);
    // استخدام قيمة افتراضية
    return 2000;
  }
}
