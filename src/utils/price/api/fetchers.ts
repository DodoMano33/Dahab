
import { supabase } from '@/lib/supabase';
import { fetchPriceFromMetalPriceApi } from './metalPriceApi';
import { mapSymbolToMetalPriceSymbol, parseCurrencyPair } from './helpers';

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
 * جلب سعر الفوركس - ملاحظة: مستخدم فقط للذهب الآن
 */
export async function fetchForexPrice(symbol: string): Promise<number | null> {
  try {
    // نتأكد أن الرمز هو XAUUSD
    if (symbol.toUpperCase() !== 'XAUUSD' && symbol.toUpperCase() !== 'GOLD' && symbol.toUpperCase() !== 'XAU') {
      console.log(`الرمز ${symbol} غير مدعوم. استخدام XAUUSD.`);
      symbol = 'XAUUSD';
    }
    
    // استخدام Metal Price API لجلب السعر
    const result = await fetchPriceFromMetalPriceApi('XAU');
    
    if (result.success && result.price !== null) {
      // تخزين السعر مؤقتًا
      setCachedPrice(symbol, result.price);
      return result.price;
    }
    
    // محاولة جلب السعر من التخزين المؤقت إذا فشلت محاولة API
    return getCachedPrice(symbol);
  } catch (error) {
    console.error(`خطأ في جلب سعر الذهب للرمز ${symbol}:`, error);
    return getCachedPrice(symbol);
  }
}

/**
 * جلب سعر العملات المشفرة (غير مستخدم الآن - يعود بسعر الذهب)
 */
export async function fetchCryptoPrice(symbol: string): Promise<number | null> {
  console.log('استخدام سعر الذهب بدلاً من العملات المشفرة');
  return fetchPreciousMetalPrice('XAUUSD');
}

/**
 * جلب سعر المعدن (الذهب فقط الآن)
 */
export async function fetchPreciousMetalPrice(symbol: string): Promise<number | null> {
  try {
    // نتأكد أن الرمز هو XAUUSD
    if (symbol.toUpperCase() !== 'XAUUSD' && symbol.toUpperCase() !== 'GOLD' && symbol.toUpperCase() !== 'XAU') {
      console.log(`الرمز ${symbol} غير مدعوم للمعادن الثمينة. استخدام XAUUSD.`);
      symbol = 'XAUUSD';
    }
    
    // استخدام Metal Price API لجلب سعر الذهب
    const result = await fetchPriceFromMetalPriceApi('XAU');
    
    if (result.success && result.price !== null) {
      // تخزين السعر مؤقتًا
      setCachedPrice(symbol, result.price);
      return result.price;
    }
    
    // محاولة جلب السعر من التخزين المؤقت إذا فشلت محاولة API
    return getCachedPrice(symbol);
  } catch (error) {
    console.error(`خطأ في جلب سعر الذهب للرمز ${symbol}:`, error);
    return getCachedPrice(symbol);
  }
}

/**
 * جلب السعر المخزن في قاعدة البيانات من real_time_prices
 */
export async function fetchStoredPrice(symbol: string): Promise<number | null> {
  try {
    // نتأكد أن الرمز هو XAUUSD للذهب من CFI
    if (symbol.toUpperCase() !== 'XAUUSD' && symbol.toUpperCase() !== 'GOLD' && symbol.toUpperCase() !== 'XAU') {
      console.log(`الرمز ${symbol} غير مدعوم. استخدام XAUUSD.`);
      symbol = 'XAUUSD';
    }
    
    const { data, error } = await supabase
      .from('real_time_prices')
      .select('price, updated_at')
      .eq('symbol', 'XAUUSD')
      .single();
    
    if (error || !data) {
      console.log(`لم يتم العثور على سعر مخزن للذهب XAUUSD`);
      return null;
    }
    
    console.log(`تم العثور على سعر مخزن للذهب XAUUSD: ${data.price}`);
    return data.price;
  } catch (error) {
    console.error(`خطأ في جلب السعر المخزن للذهب:`, error);
    return null;
  }
}
