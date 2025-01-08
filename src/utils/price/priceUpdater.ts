import { fetchForexPrice, fetchStockPrice } from './api';

class PriceUpdater {
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // مدة صلاحية الكاش (دقيقة واحدة)

  async fetchPrice(symbol: string): Promise<number> {
    console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

    // التحقق من وجود سعر محدث في الكاش
    const cachedData = this.priceCache.get(symbol);
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
      console.log(`استخدام السعر المخزن في الكاش للرمز ${symbol}: ${cachedData.price}`);
      return cachedData.price;
    }

    try {
      let price: number;
      
      if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) {
        price = await fetchForexPrice(symbol);
      } else {
        price = await fetchStockPrice(symbol);
      }

      // تخزين السعر الجديد في الكاش
      this.priceCache.set(symbol, {
        price,
        timestamp: Date.now()
      });

      console.log(`تم جلب وتخزين سعر جديد للرمز ${symbol}: ${price}`);
      return price;
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      throw error;
    }
  }

  clearCache() {
    this.priceCache.clear();
    console.log('تم مسح الكاش');
  }
}

export const priceUpdater = new PriceUpdater();