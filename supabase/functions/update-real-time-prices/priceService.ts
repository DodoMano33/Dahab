
import { fetchPriceFromMetalPriceApi } from './metalPriceApi.ts';

/**
 * جلب السعر الحالي للرمز المحدد
 */
export async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    // استخدام Metal Price API لجلب السعر
    const price = await fetchPriceFromMetalPriceApi(symbol);
    return price;
  } catch (error) {
    console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
    return null;
  }
}
