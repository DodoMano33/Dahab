import { fetchForexPrice, fetchCryptoPrice } from './api';

class PriceUpdater {
  private lastPrices: Map<string, { price: number; timestamp: number }> = new Map();
  private CACHE_DURATION = 5000; // 5 seconds cache

  async fetchPrice(symbol: string, providedPrice?: number): Promise<number> {
    try {
      console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

      if (!symbol) {
        throw new Error("الرمز غير صالح");
      }

      // إذا تم توفير سعر، استخدمه مباشرة
      if (providedPrice !== undefined) {
        console.log(`استخدام السعر المقدم للرمز ${symbol}: ${providedPrice}`);
        this.lastPrices.set(symbol, { price: providedPrice, timestamp: Date.now() });
        return providedPrice;
      }

      // التحقق من الذاكرة المؤقتة
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log(`استخدام السعر المخزن للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      let price: number;
      if (symbol.endsWith('USD')) {
        if (symbol.startsWith('BTC') || symbol.startsWith('ETH')) {
          price = await fetchCryptoPrice(symbol);
        } else {
          price = await fetchForexPrice(symbol);
        }
      } else {
        throw new Error("رمز غير مدعوم");
      }

      this.lastPrices.set(symbol, { price, timestamp: Date.now() });
      return price;
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      throw error;
    }
  }
}

export const priceUpdater = new PriceUpdater();