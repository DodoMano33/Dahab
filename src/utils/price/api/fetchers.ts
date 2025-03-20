
import { supabase } from '@/lib/supabase';

/**
 * تم حذف وظائف جلب الأسعار سابقاً.
 * يجب إضافة مصدر السعر الجديد هنا.
 */

/**
 * تخزين السعر مؤقتًا
 */
export const setCachedPrice = (symbol: string, price: number) => {
  localStorage.setItem(`price_${symbol}`, price.toString());
};

/**
 * جلب السعر من الذاكرة المؤقتة
 */
export const getCachedPrice = (symbol: string): number | null => {
  const priceStr = localStorage.getItem(`price_${symbol}`);
  return priceStr ? parseFloat(priceStr) : null;
};

/**
 * جلب سعر الفوركس - تم حذف المصدر السابق
 */
export async function fetchForexPrice(symbol: string): Promise<number | null> {
  console.log(`تم حذف وظيفة جلب سعر الفوركس للرمز ${symbol} وتحتاج إلى تنفيذ المصدر الجديد`);
  return null;
}

/**
 * جلب سعر العملات المشفرة - تم حذف المصدر السابق
 */
export async function fetchCryptoPrice(symbol: string): Promise<number | null> {
  console.log(`تم حذف وظيفة جلب سعر العملات المشفرة للرمز ${symbol} وتحتاج إلى تنفيذ المصدر الجديد`);
  return null;
}

/**
 * جلب سعر المعدن - تم حذف المصدر السابق
 */
export async function fetchPreciousMetalPrice(symbol: string): Promise<number | null> {
  console.log(`تم حذف وظيفة جلب سعر المعدن الثمين للرمز ${symbol} وتحتاج إلى تنفيذ المصدر الجديد`);
  return null;
}

/**
 * جلب السعر المخزن في قاعدة البيانات من real_time_prices
 */
export async function fetchStoredPrice(symbol: string): Promise<number | null> {
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
