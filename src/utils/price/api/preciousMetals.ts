
import { PRECIOUS_METALS } from "../config";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";
import { PriceResponse } from "./types";

/**
 * جلب سعر الذهب والمعادن الثمينة
 */
export const fetchPreciousMetalPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const metalConfig = PRECIOUS_METALS[upperSymbol as keyof typeof PRECIOUS_METALS];
    
    let base = 'XAU'; // الافتراضي للذهب
    let target = 'USD';
    
    if (metalConfig) {
      base = metalConfig.base;
      target = metalConfig.target;
    } else if (upperSymbol === 'XAUUSD' || upperSymbol === 'GOLD') {
      base = 'XAU';
    } else if (upperSymbol === 'XAGUSD' || upperSymbol === 'SILVER') {
      base = 'XAG';
    }
    
    console.log(`جلب سعر المعدن الثمين: ${base}/${target}`);
    
    const result = await fetchPriceFromMetalPriceApi(base, target);
    
    if (result.success && result.price !== null) {
      return result.price;
    }
    
    console.log(`فشل في جلب سعر المعدن الثمين للرمز ${symbol}`);
    return null;
  } catch (error) {
    console.error(`خطأ في fetchPreciousMetalPrice للرمز ${symbol}:`, error);
    return null;
  }
};
