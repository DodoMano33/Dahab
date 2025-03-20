
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
    
    let symbolToFetch = 'XAU'; // الافتراضي للذهب
    
    if (metalConfig) {
      symbolToFetch = metalConfig.base;
    } else if (upperSymbol === 'XAUUSD' || upperSymbol === 'GOLD') {
      symbolToFetch = 'XAU';
    } else if (upperSymbol === 'XAGUSD' || upperSymbol === 'SILVER') {
      symbolToFetch = 'XAG';
    }
    
    console.log(`جلب سعر المعدن الثمين: ${symbolToFetch}`);
    
    const result = await fetchPriceFromMetalPriceApi(symbolToFetch);
    
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
