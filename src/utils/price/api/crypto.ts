
import { parseCurrencyPair } from "./helpers";
import { CRYPTO_SYMBOLS } from "../config";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";

/**
 * جلب سعر العملات الرقمية
 */
export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const cryptoConfig = CRYPTO_SYMBOLS[upperSymbol as keyof typeof CRYPTO_SYMBOLS];
    
    let base: string;
    let target: string;
    
    if (cryptoConfig) {
      base = cryptoConfig.base;
      target = cryptoConfig.target;
    } else {
      // استخدام الرمز كما هو مع الهدف الافتراضي USD
      const parsedPair = parseCurrencyPair(upperSymbol);
      base = parsedPair.base;
      target = parsedPair.target;
    }
    
    const result = await fetchPriceFromMetalPriceApi(base, target);
    return result.success ? result.price : null;
  } catch (error) {
    console.error(`خطأ في fetchCryptoPrice للرمز ${symbol}:`, error);
    return null;
  }
};
