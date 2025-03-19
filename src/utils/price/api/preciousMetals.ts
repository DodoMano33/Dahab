
import { PRECIOUS_METALS } from "../config";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";

/**
 * جلب سعر الذهب والمعادن الثمينة
 */
export const fetchPreciousMetalPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const metalConfig = PRECIOUS_METALS[upperSymbol as keyof typeof PRECIOUS_METALS];
    
    if (metalConfig) {
      const result = await fetchPriceFromMetalPriceApi(metalConfig.base, metalConfig.target);
      return result.success ? result.price : null;
    } else {
      // افتراضي للذهب
      const result = await fetchPriceFromMetalPriceApi('XAU', 'USD');
      return result.success ? result.price : null;
    }
  } catch (error) {
    console.error(`خطأ في fetchPreciousMetalPrice للرمز ${symbol}:`, error);
    return null;
  }
};
