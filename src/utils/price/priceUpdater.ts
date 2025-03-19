
import { fetchCryptoPrice, fetchForexPrice } from './api';

export class PriceUpdater {
  private rateLimitHit: boolean = false;
  private lastRateLimitTime: number = 0;
  private readonly RATE_LIMIT_RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours
  private cachedPrices: Record<string, { price: number, timestamp: number }> = {};
  private readonly CACHE_LIFETIME = 60 * 1000; // 1 minute cache

  async retry<T>(fn: () => Promise<T>, maxAttempts: number = 3): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Retry attempt ${attempt}/${maxAttempts}`);
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (error instanceof Error && error.message.includes('rate limit')) {
          this.rateLimitHit = true;
          this.lastRateLimitTime = Date.now();
          throw error; // Don't retry if rate limited
        }
        if (attempt === maxAttempts) {
          console.error('Max retries reached:', { _type: 'Error', value: error });
          throw lastError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw lastError;
  }

  isRateLimited(): boolean {
    if (!this.rateLimitHit) return false;
    
    const now = Date.now();
    const timeSinceLimit = now - this.lastRateLimitTime;
    
    if (timeSinceLimit >= this.RATE_LIMIT_RESET_TIME) {
      this.rateLimitHit = false;
      return false;
    }
    
    return true;
  }
  
  getCachedPrice(symbol: string): number | null {
    const cachedData = this.cachedPrices[symbol];
    if (!cachedData) return null;
    
    const now = Date.now();
    if (now - cachedData.timestamp > this.CACHE_LIFETIME) return null;
    
    console.log(`استخدام السعر المخزن مؤقتًا للرمز ${symbol}: ${cachedData.price}`);
    return cachedData.price;
  }
  
  setCachedPrice(symbol: string, price: number): void {
    this.cachedPrices[symbol] = {
      price,
      timestamp: Date.now()
    };
  }

  async fetchPrice(symbol: string): Promise<number | null> {
    if (this.isRateLimited()) {
      const cachedPrice = this.getCachedPrice(symbol);
      if (cachedPrice !== null) return cachedPrice;
      throw new Error('API rate limit reached');
    }
    
    // تحقق من الذاكرة المؤقتة أولاً
    const cachedPrice = this.getCachedPrice(symbol);
    if (cachedPrice !== null) return cachedPrice;

    console.log('بدء محاولة جلب السعر للرمز', symbol);
    
    try {
      // Try crypto first
      try {
        const cryptoPrice = await this.retry(async () => {
          console.log('محاولة جلب سعر العملة المشفرة للرمز', symbol.toLowerCase());
          return await fetchCryptoPrice(symbol.toLowerCase());
        });
        
        if (cryptoPrice !== null) {
          this.setCachedPrice(symbol, cryptoPrice);
          return cryptoPrice;
        }
      } catch (error) {
        console.log('فشل في جلب سعر العملة المشفرة، جاري محاولة الفوركس...');
      }

      // Try forex as fallback
      try {
        const formattedSymbol = symbol.replace(/[^A-Z]/g, '').slice(0, 6);
        console.log('محاولة جلب سعر الفوركس للرمز', formattedSymbol);
        
        const forexPrice = await this.retry(async () => {
          return await fetchForexPrice(formattedSymbol);
        });
        
        if (forexPrice !== null) {
          this.setCachedPrice(symbol, forexPrice);
          return forexPrice;
        }
      } catch (error) {
        console.log('لم يتم العثور على سعر صالح للرمز', symbol);
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate limit')) {
        this.rateLimitHit = true;
        this.lastRateLimitTime = Date.now();
      }
      throw error;
    }
  }
}

export const priceUpdater = new PriceUpdater();
