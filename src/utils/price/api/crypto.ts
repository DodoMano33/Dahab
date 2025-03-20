
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
    
    console.log(`جلب سعر العملة الرقمية: ${base}/${target}`);
    
    const result = await fetchPriceFromMetalPriceApi(base, target);
    
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
