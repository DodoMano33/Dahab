import { fetchCryptoPrice, fetchForexPrice } from './api';
import { CRYPTO_SYMBOLS, FOREX_SYMBOLS } from './config';

export class PriceUpdater {
  async fetchPrice(symbol: string, providedPrice?: number): Promise<number> {
    console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

    try {
      // Check if it's a crypto symbol (including USDT pairs)
      const isCrypto = symbol.includes('USDT') || 
                      symbol in CRYPTO_SYMBOLS || 
                      Object.keys(CRYPTO_SYMBOLS).some(key => symbol.startsWith(key));
      
      if (isCrypto) {
        console.log(`محاولة جلب سعر العملة المشفرة: ${symbol}`);
        return await fetchCryptoPrice(symbol, providedPrice);
      } else if (symbol in FOREX_SYMBOLS || symbol === 'XAUUSD') {
        console.log(`محاولة جلب سعر الفوركس: ${symbol}`);
        return await fetchForexPrice(symbol, providedPrice);
      } else {
        console.warn(`الرمز ${symbol} غير مدعوم، استخدام السعر المقدم`);
        if (providedPrice !== undefined) {
          return providedPrice;
        }
        throw new Error(`الرمز ${symbol} غير مدعوم`);
      }
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      
      if (providedPrice !== undefined) {
        console.log(`استخدام السعر المقدم من المستخدم: ${providedPrice}`);
        return providedPrice;
      }
      
      throw error;
    }
  }
}

export const priceUpdater = new PriceUpdater();