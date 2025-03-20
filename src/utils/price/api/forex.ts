
import { parseCurrencyPair } from "./helpers";
import { FOREX_SYMBOLS } from "../config";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";
import { PriceResponse } from "./types";

/**
 * جلب سعر الفوركس
 */
export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const forexConfig = FOREX_SYMBOLS[upperSymbol as keyof typeof FOREX_SYMBOLS];
    
    let symbolToFetch: string;
    
    if (forexConfig) {
      symbolToFetch = forexConfig.from;
    } else {
      // تقسيم زوج الفوركس إلى عملتين أساسية ومقابلة
      const parsedPair = parseCurrencyPair(upperSymbol);
      symbolToFetch = parsedPair.base;
    }
    
    console.log(`جلب سعر الفوركس: ${symbolToFetch}`);
    
    const result = await fetchPriceFromMetalPriceApi(symbolToFetch);
    
    if (result.success && result.price !== null) {
      return result.price;
    }
    
    console.log(`فشل في جلب سعر الفوركس للرمز ${symbol}`);
    return null;
  } catch (error) {
    console.error(`خطأ في fetchForexPrice للرمز ${symbol}:`, error);
    return null;
  }
};
