
import { supabase } from '@/lib/supabase';
import { checkRateLimit, setRateLimited } from './rateLimit';

const METAL_PRICE_API_BASE_URL = 'https://api.metalpriceapi.com/v1';
const METAL_PRICE_API_KEY = '42ed2fe2e7d1d8f688ddeb027219c766';

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
 * جلب سعر المعدن من Metal Price API
 */
export async function fetchPriceFromMetalPriceApi(symbol: string): Promise<number | null> {
  try {
    if (checkRateLimit()) {
      console.warn('تم تجاوز الحد المسموح به لعدد الطلبات في الدقيقة.');
      return null;
    }

    // للاختبار: دعم الرموز المختلفة
    let useSymbol = symbol.toLowerCase();
    
    // تعيينات خاصة
    if (symbol.toUpperCase() === 'XAUUSD') useSymbol = 'gold';
    if (symbol.toUpperCase() === 'XAGUSD') useSymbol = 'silver';
    if (symbol.toUpperCase() === 'GOLD') useSymbol = 'gold';

    const url = `${METAL_PRICE_API_BASE_URL}/latest?api_key=${METAL_PRICE_API_KEY}&base=USD&currencies=${useSymbol}`;
    console.log(`جاري الاتصال بـ Metal Price API: ${url.replace(METAL_PRICE_API_KEY, 'API_KEY_HIDDEN')}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`خطأ في استجابة Metal Price API: ${response.status}`, errorText);

      if (response.status === 429) {
        console.error('تم تجاوز حد معدل استخدام Metal Price API');
        setRateLimited(true);
      }

      return null;
    }

    const data = await response.json();

    if (data && data.rates && data.rates[useSymbol]) {
      // قلب السعر لأن الأساس هو USD
      const price = 1 / data.rates[useSymbol];
      console.log(`تم جلب السعر للرمز ${symbol}: ${price}`);
      return price;
    }

    console.error(`لم يتم العثور على سعر للرمز ${symbol} في استجابة API:`, data);
    return null;
  } catch (error) {
    console.error(`خطأ في جلب السعر من Metal Price API للرمز ${symbol}:`, error);
    return null;
  }
}

/**
 * جلب سعر الفوركس
 */
export async function fetchForexPrice(symbol: string): Promise<number | null> {
    try {
        console.log(`جلب سعر الفوركس للرمز ${symbol}`);
        return await fetchPriceFromMetalPriceApi(symbol);
    } catch (error) {
        console.error(`خطأ في جلب سعر الفوركس للرمز ${symbol}:`, error);
        return null;
    }
}

/**
 * جلب سعر العملات المشفرة
 */
export async function fetchCryptoPrice(symbol: string): Promise<number | null> {
    try {
        console.log(`جلب سعر العملات المشفرة للرمز ${symbol}`);
        return await fetchPriceFromMetalPriceApi(symbol);
    } catch (error) {
        console.error(`خطأ في جلب سعر العملات المشفرة للرمز ${symbol}:`, error);
        return null;
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
    
    const { price, updated_at } = data;
    
    // التحقق من أن السعر حديث (أقل من 5 دقائق)
    const timestamp = new Date(updated_at).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (now - timestamp > fiveMinutes) {
      console.log(`السعر المخزن للرمز ${symbol} قديم (${new Date(updated_at).toLocaleTimeString()})`);
      return null;
    }
    
    console.log(`تم العثور على سعر مخزن حديث للرمز ${symbol}: ${price}`);
    return price;
  } catch (error) {
    console.error(`خطأ في جلب السعر المخزن للرمز ${symbol}:`, error);
    return null;
  }
}

/**
 * جلب سعر المعدن من Metal Price API
 */
export async function fetchPreciousMetalPrice(symbol: string): Promise<number | null> {
  try {
    console.log(`جلب السعر من Metal Price API للرمز ${symbol}`);
    return await fetchPriceFromMetalPriceApi(symbol);
  } catch (error) {
    console.error(`خطأ في جلب سعر المعدن الثمين للرمز ${symbol}:`, error);
    return null;
  }
}
