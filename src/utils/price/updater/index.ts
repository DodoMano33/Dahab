
import { fetchPrice } from '../api';
import { PriceSubscription } from '../types';
import { PriceCache } from './cache';
import { RateLimitManager } from './rateLimit';
import { retry } from './retry';
import { SubscriptionService } from './subscriptions';
import { PriceUpdaterConfig, RetryOptions } from './types';

/**
 * محدث الأسعار - الفئة الرئيسية لإدارة تحديثات الأسعار والاشتراكات
 */
export class PriceUpdater {
  private cache: PriceCache;
  private rateLimit: RateLimitManager;
  private subscriptions: SubscriptionService;
  private retryOptions: RetryOptions;
  private polling: boolean = false;
  private pollingInterval: number = 300000; // 5 دقائق
  private intervalId?: NodeJS.Timeout;

  constructor(config: Partial<PriceUpdaterConfig> = {}) {
    const {
      rateLimitResetTime = 24 * 60 * 60 * 1000, // 24 ساعة
      cacheLifetime = 60 * 1000 // 1 دقيقة
    } = config;
    
    this.cache = new PriceCache(cacheLifetime);
    this.rateLimit = new RateLimitManager(rateLimitResetTime);
    this.subscriptions = new SubscriptionService();
    this.retryOptions = {
      maxAttempts: 3,
      initialDelay: 1000
    };
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
    const cachedPrice = this.cache.get(symbol);
    return cachedPrice;
  }

  /**
   * الاشتراك في تحديثات السعر
   */
  subscribe(subscription: PriceSubscription, providedPrice?: number) {
    const { symbol } = subscription;
    console.log(`اشتراك جديد للرمز ${symbol}`);
    
    this.subscriptions.subscribe(subscription);

    // جلب السعر الأولي
    this.fetchPrice(symbol, providedPrice)
      .then(price => {
        if (price !== null) {
          console.log(`تم جلب السعر الأولي للرمز ${symbol}: ${price}`);
          this.subscriptions.notifySubscribers(symbol, price);
        } else {
          console.error(`لم يتم العثور على سعر أولي للرمز ${symbol}`);
          this.subscriptions.notifyError(symbol, new Error(`لم يتم العثور على سعر للرمز ${symbol}`));
        }
      })
      .catch(error => {
        console.error(`خطأ في جلب السعر الأولي للرمز ${symbol}:`, error);
        this.subscriptions.notifyError(symbol, error as Error);
      });
      
    // بدء التحديث الدوري إذا لم يكن قد بدأ بالفعل
    this.startPolling();
  }

  /**
   * إلغاء الاشتراك من تحديثات السعر
   */
  unsubscribe(symbol: string, callback: (price: number) => void) {
    console.log(`إلغاء اشتراك للرمز ${symbol}`);
    this.subscriptions.unsubscribe(symbol, callback);
    
    // إيقاف التحديث الدوري إذا لم تعد هناك اشتراكات
    if (this.subscriptions.getSubscribedSymbols().length === 0) {
      this.stopPolling();
    }
  }
  
  /**
   * بدء التحديث الدوري للأسعار
   */
  private startPolling() {
    if (this.polling) return;
    
    console.log("بدء التحديث الدوري للأسعار من Metal Price API");
    this.polling = true;
    
    this.intervalId = setInterval(async () => {
      const symbols = this.subscriptions.getSubscribedSymbols();
      for (const symbol of symbols) {
        try {
          const price = await this.fetchPrice(symbol);
          if (price !== null) {
            this.subscriptions.notifySubscribers(symbol, price);
          } else {
            this.subscriptions.notifyError(
              symbol, 
              new Error(`لم يتم العثور على سعر للرمز ${symbol}`)
            );
          }
        } catch (error) {
          console.error(`خطأ في تحديث السعر للرمز ${symbol}:`, error);
          this.subscriptions.notifyError(symbol, error as Error);
        }
      }
    }, this.pollingInterval);
  }
  
  /**
   * إيقاف التحديث الدوري للأسعار
   */
  private stopPolling() {
    if (!this.polling) return;
    
    console.log("إيقاف التحديث الدوري للأسعار");
    this.polling = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  /**
   * التحقق من حالة حد معدل الاستخدام
   */
  isRateLimited(): boolean {
    return this.rateLimit.isRateLimited();
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

  /**
   * مسح الذاكرة المؤقتة للرمز المحدد
   */
  invalidateCache(symbol?: string): void {
    if (symbol) {
      this.cache.invalidate(symbol);
    } else {
      this.cache.clear();
    }
  }
}

/**
 * إنشاء نسخة عامة من محدث الأسعار
 */
export const priceUpdater = new PriceUpdater();
