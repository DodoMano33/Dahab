
import { parseCurrencyPair } from "./helpers";
import { FOREX_SYMBOLS } from "../config";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";

/**
 * جلب سعر الفوركس
 */
export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const forexConfig = FOREX_SYMBOLS[upperSymbol as keyof typeof FOREX_SYMBOLS];
    
    let from: string;
    let to: string;
    
    if (forexConfig) {
      from = forexConfig.from;
      to = forexConfig.to;
    } else {
      // تقسيم زوج الفوركس إلى عملتين أساسية ومقابلة
      const parsedPair = parseCurrencyPair(upperSymbol);
      from = parsedPair.base;
      to = parsedPair.target;
    }
    
    const result = await fetchPriceFromMetalPriceApi(from, to);
    return result.success ? result.price : null;
  } catch (error) {
    console.error(`خطأ في fetchForexPrice للرمز ${symbol}:`, error);
    return null;
  }
};
