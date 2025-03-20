
import { parseCurrencyPair } from "./helpers";
import { CRYPTO_SYMBOLS } from "../config";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";
import { PriceResponse } from "./types";

/**
 * جلب سعر العملات الرقمية
 */
export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const cryptoConfig = CRYPTO_SYMBOLS[upperSymbol as keyof typeof CRYPTO_SYMBOLS];
    
    let symbolToFetch: string;
    
    if (cryptoConfig) {
      symbolToFetch = cryptoConfig.base;
    } else {
      // استخدام الرمز كما هو مع الهدف الافتراضي USD
      const parsedPair = parseCurrencyPair(upperSymbol);
      symbolToFetch = parsedPair.base;
    }
    
    console.log(`جلب سعر العملة الرقمية: ${symbolToFetch}`);
    
    const result = await fetchPriceFromMetalPriceApi(symbolToFetch);
    
    if (result.success && result.price !== null) {
      return result.price;
    }
    
    console.log(`فشل في جلب سعر العملة الرقمية للرمز ${symbol}`);
    return null;
  } catch (error) {
    console.error(`خطأ في fetchCryptoPrice للرمز ${symbol}:`, error);
    return null;
  }
};
