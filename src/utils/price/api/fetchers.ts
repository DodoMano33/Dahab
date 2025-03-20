
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
 * جلب سعر الفوركس
 */
export async function fetchForexPrice(symbol: string): Promise<number | null> {
  try {
    // تحليل زوج العملات
    const { base, target } = parseCurrencyPair(symbol);
    
    // استخدام Metal Price API لجلب السعر
    const result = await fetchPriceFromMetalPriceApi(base, target);
    
    if (result.success && result.price !== null) {
      // تخزين السعر مؤقتًا
      setCachedPrice(symbol, result.price);
      return result.price;
    }
    
    // محاولة جلب السعر من التخزين المؤقت إذا فشلت محاولة API
    return getCachedPrice(symbol);
  } catch (error) {
    console.error(`خطأ في جلب سعر الفوركس للرمز ${symbol}:`, error);
    return getCachedPrice(symbol);
  }
}

/**
 * جلب سعر العملات المشفرة
 */
export async function fetchCryptoPrice(symbol: string): Promise<number | null> {
  try {
    // تنظيف الرمز
    const cleanSymbol = symbol.replace('CAPITALCOM:', '').toUpperCase();
    const base = cleanSymbol.includes('USD') ? cleanSymbol.replace('USD', '') : cleanSymbol;
    
    // استخدام Metal Price API لجلب السعر
    const result = await fetchPriceFromMetalPriceApi(base, 'USD');
    
    if (result.success && result.price !== null) {
      // تخزين السعر مؤقتًا
      setCachedPrice(symbol, result.price);
      return result.price;
    }
    
    // محاولة جلب السعر من التخزين المؤقت إذا فشلت محاولة API
    return getCachedPrice(symbol);
  } catch (error) {
    console.error(`خطأ في جلب سعر العملات المشفرة للرمز ${symbol}:`, error);
    return getCachedPrice(symbol);
  }
}

/**
 * جلب سعر المعدن
 */
export async function fetchPreciousMetalPrice(symbol: string): Promise<number | null> {
  try {
    // تحويل الرمز إلى صيغة Metal Price API
    const metalSymbol = mapSymbolToMetalPriceSymbol(symbol);
    
    // استخدام Metal Price API لجلب السعر
    const result = await fetchPriceFromMetalPriceApi(metalSymbol, 'USD');
    
    if (result.success && result.price !== null) {
      // تخزين السعر مؤقتًا
      setCachedPrice(symbol, result.price);
      return result.price;
    }
    
    // محاولة جلب السعر من التخزين المؤقت إذا فشلت محاولة API
    return getCachedPrice(symbol);
  } catch (error) {
    console.error(`خطأ في جلب سعر المعدن للرمز ${symbol}:`, error);
    return getCachedPrice(symbol);
  }
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
