
import { supabase } from "@/lib/supabase";

/**
 * الحصول على سعر المخزن من قاعدة البيانات
 */
export const getStoredPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنظيف وتوحيد الرمز
    const cleanSymbol = symbol.toUpperCase();
    
    // نستخدم فقط XAUUSD للذهب
    const symbolToFetch = cleanSymbol.includes('XAU') || 
                          cleanSymbol.includes('GOLD') ? 'XAUUSD' : cleanSymbol;
    
    console.log(`جلب السعر المخزن للرمز: ${symbolToFetch}`);
    
    const { data, error } = await supabase
      .from('real_time_prices')
      .select('price, updated_at')
      .eq('symbol', symbolToFetch)
      .single();
    
    if (error) {
      console.error(`خطأ في جلب السعر المخزن للرمز ${symbolToFetch}:`, error);
      return null;
    }
    
    if (data && data.price) {
      const timeSinceUpdate = new Date().getTime() - new Date(data.updated_at).getTime();
      const isStale = timeSinceUpdate > 12 * 60 * 60 * 1000; // 12 ساعة
      
      if (isStale) {
        console.warn(`السعر المخزن للرمز ${symbolToFetch} قديم (${Math.round(timeSinceUpdate / (60 * 60 * 1000))} ساعات)`);
      } else {
        console.log(`تم استرجاع السعر المخزن للرمز ${symbolToFetch}: ${data.price}`);
      }
      
      return data.price;
    }
    
    console.log(`لم يتم العثور على سعر مخزن للرمز ${symbolToFetch}`);
    return null;
  } catch (error) {
    console.error(`خطأ في getStoredPrice للرمز ${symbol}:`, error);
    return null;
  }
};

/**
 * الحصول على مفتاح API لـ Metal Price
 */
export const getMetalPriceApiKey = (): string => {
  return '42ed2fe2e7d1d8f688ddeb027219c766';
};

/**
 * تحويل رمز المعدن الثمين إلى الصيغة الموحدة
 */
export const normalizePreciousMetalSymbol = (symbol: string): string => {
  const upperSymbol = symbol.toUpperCase();
  
  if (upperSymbol.includes('XAU') || upperSymbol.includes('GOLD')) {
    return 'XAU';
  }
  
  return upperSymbol;
};
