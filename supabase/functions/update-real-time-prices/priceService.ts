
import { fetchPriceFromMetalPriceApi } from './metalPriceApi.ts';

/**
 * جلب السعر الحالي للرمز المحدد
 */
export async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    // محاولة جلب السعر من Metal Price API
    const price = await fetchPriceFromMetalPriceApi(symbol);
    return price;
  } catch (error) {
    console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
    return null;
  }
}
