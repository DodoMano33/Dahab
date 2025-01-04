import { fetchCryptoPrice, fetchForexPrice } from './api';
import { CRYPTO_SYMBOLS, FOREX_SYMBOLS } from './config';

export class PriceUpdater {
  async fetchPrice(symbol: string, providedPrice?: number): Promise<number> {
    console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

    try {
      if (symbol in CRYPTO_SYMBOLS) {
        return await fetchCryptoPrice(symbol, providedPrice);
      } else if (symbol in FOREX_SYMBOLS || symbol === 'XAUUSD') {
        return await fetchForexPrice(symbol, providedPrice);
      } else {
        throw new Error(`الرمز ${symbol} غير مدعوم`);
      }
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      
      // إذا كان هناك سعر مقدم من المستخدم، نستخدمه في حالة الخطأ
      if (providedPrice !== undefined) {
        console.log(`استخدام السعر المقدم من المستخدم: ${providedPrice}`);
        return providedPrice;
      }
      
      throw error;
    }
  }
}

export const priceUpdater = new PriceUpdater();