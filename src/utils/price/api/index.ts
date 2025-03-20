
// تصدير الدوال والأنواع من ملفات API المختلفة
export * from './fetchers';
export * from './types';
export * from './helpers';
export * from './rateLimit';
export * from './cache';
export * from './forex';
export * from './crypto';
export * from './preciousMetals';

// جلب السعر المناسب بناءً على الرمز
import { FOREX_SYMBOLS, CRYPTO_SYMBOLS, PRECIOUS_METALS } from '../config';
import { fetchForexPrice } from './forex';
import { fetchCryptoPrice } from './crypto';
import { fetchPreciousMetalPrice } from './preciousMetals';
import { mapSymbolToMetalPriceSymbol } from './helpers';

/**
 * جلب السعر المناسب بناءً على الرمز
 */
export const fetchPrice = async (symbol: string): Promise<number | null> => {
  try {
    console.log(`بدء جلب السعر للرمز: ${symbol}`);
    
    // تنظيف الرمز
    const cleanSymbol = symbol.replace('CAPITALCOM:', '').toUpperCase();
    
    // تحديد نوع الرمز
    if (cleanSymbol in FOREX_SYMBOLS) {
      return await fetchForexPrice(cleanSymbol);
    }
    
    if (cleanSymbol in CRYPTO_SYMBOLS) {
      return await fetchCryptoPrice(cleanSymbol);
    }
    
    if (cleanSymbol in PRECIOUS_METALS || cleanSymbol === 'GOLD' || cleanSymbol === 'XAUUSD') {
      return await fetchPreciousMetalPrice(cleanSymbol);
    }
    
    // لأي رمز آخر، نحاول استخدام Metal Price API مباشرة
    const mappedSymbol = mapSymbolToMetalPriceSymbol(cleanSymbol);
    console.log(`استخدام الرمز المُعيّن: ${mappedSymbol} للرمز الأصلي: ${cleanSymbol}`);
    
    return await fetchPreciousMetalPrice(mappedSymbol);
  } catch (error) {
    console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
    return null;
  }
};
