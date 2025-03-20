
import { fetchPrice } from '../api';
import { PriceCache } from './cache';
import { RateLimitManager } from './rateLimit';
import { retry } from './retry';
import { RetryOptions } from './types';

export class PriceFetcher {
  private retryOptions: RetryOptions;
  
  constructor(
    private cache: PriceCache,
    private rateLimit: RateLimitManager,
    retryOptions: RetryOptions = { maxAttempts: 3, initialDelay: 1000 }
  ) {
    this.retryOptions = retryOptions;
  }

  /**
   * جلب سعر الرمز المحدد
   */
  async fetchPrice(symbol: string, providedPrice?: number): Promise<number | null> {
    try {
      console.log(`بدء محاولة جلب السعر للرمز ${symbol} من Metal Price API`);

      if (!symbol) {
        throw new Error("الرمز غير صالح");
      }
      
      // إذا تم توفير سعر، استخدمه مباشرة
      if (providedPrice !== undefined) {
        console.log(`استخدام السعر المقدم للرمز ${symbol}: ${providedPrice}`);
        this.cache.set(symbol, providedPrice);
        return providedPrice;
      }

      // التحقق من الذاكرة المؤقتة أولاً
      const cachedPrice = this.cache.get(symbol);
      if (cachedPrice !== null) return cachedPrice;

      // التحقق من حالة حد معدل الاستخدام
      if (this.rateLimit.isRateLimited()) {
        console.log(`تم تجاوز حد معدل API للرمز ${symbol}`);
        return this.handleRateLimitedFetch(symbol);
      }

      // محاولة جلب السعر من API باستخدام وظيفة إعادة المحاولة
      const price = await this.fetchPriceWithRetry(symbol);

      if (price !== null) {
        console.log(`تم جلب السعر من Metal Price API للرمز ${symbol}: ${price}`);
        this.cache.set(symbol, price);
        
        // إرسال حدث تحديث السعر
        window.dispatchEvent(new CustomEvent('metal-price-update', {
          detail: { price, symbol }
        }));
        
        return price;
      }

      // إذا لم يتم العثور على سعر، استخدم آخر سعر معروف أو null
      if (cachedPrice) {
        console.log(`لم يتم العثور على سعر جديد للرمز ${symbol}، استخدام آخر سعر مخزن: ${cachedPrice}`);
        return cachedPrice;
      }
      
      console.log(`لم يتم العثور على سعر للرمز ${symbol}`);
      return null;
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      
      // في حالة الخطأ، نستخدم آخر سعر معروف أو null
      const cachedPrice = this.cache.get(symbol);
      if (cachedPrice !== null) {
        return cachedPrice;
      }
      
      return null;
    }
  }

  /**
   * جلب السعر مع إعادة المحاولة
   */
  private async fetchPriceWithRetry(symbol: string): Promise<number | null> {
    return retry(
      async () => {
        const result = await fetchPrice(symbol);
        return result;
      },
      this.retryOptions
    );
  }

  /**
   * التعامل مع حالة تجاوز حد معدل الاستخدام
   */
  private handleRateLimitedFetch(symbol: string): number | null {
    // محاولة استخدام السعر المخزن مؤقتًا
    return this.cache.get(symbol);
  }
  
  /**
   * تعيين خيارات إعادة المحاولة
   */
  setRetryOptions(options: Partial<RetryOptions>): void {
    this.retryOptions = {
      ...this.retryOptions,
      ...options
    };
  }
}
