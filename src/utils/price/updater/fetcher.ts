import { fetchPrice } from '../api';
import { RateLimitManager } from './rateLimit';
import { retry } from './retry';
import { RetryOptions } from './types';

export class PriceFetcher {
  private retryOptions: RetryOptions;
  
  constructor(
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
        return providedPrice;
      }

      // التحقق من حالة حد معدل الاستخدام
      if (this.rateLimit.isRateLimited()) {
        console.log(`تم تجاوز حد معدل API للرمز ${symbol}`);
        return null;
      }

      // محاولة جلب السعر من API باستخدام وظيفة إعادة المحاولة
      const price = await this.fetchPriceWithRetry(symbol);

      if (price !== null) {
        console.log(`تم جلب السعر من Metal Price API للرمز ${symbol}: ${price}`);
        
        // إرسال حدث تحديث السعر
        window.dispatchEvent(new CustomEvent('metal-price-update', {
          detail: { price, symbol }
        }));
        
        return price;
      }
      
      console.log(`لم يتم العثور على سعر للرمز ${symbol}`);
      return null;
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
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
   * تعيين خيارات إعادة المحاولة
   */
  setRetryOptions(options: Partial<RetryOptions>): void {
    this.retryOptions = {
      ...this.retryOptions,
      ...options
    };
  }
}
