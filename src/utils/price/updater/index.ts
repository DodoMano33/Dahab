
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
   * الاشتراك في تحديثات السعر
   */
  subscribe(subscription: PriceSubscription): void {
    this.subscriptions.subscribe(subscription);
    
    // محاولة جلب السعر الأولي
    this.fetchInitialPrice(subscription);
  }

  /**
   * جلب السعر الأولي للمشترك الجديد
   */
  private fetchInitialPrice(subscription: PriceSubscription): void {
    this.fetchPrice(subscription.symbol)
      .then(price => {
        if (price !== null) {
          this.subscriptions.notifySubscribers(subscription.symbol, price);
        }
      })
      .catch(error => {
        this.subscriptions.notifyError(subscription.symbol, error);
      });
  }

  /**
   * إلغاء الاشتراك من تحديثات السعر
   */
  unsubscribe(symbol: string, callback: (price: number) => void): void {
    this.subscriptions.unsubscribe(symbol, callback);
  }

  /**
   * جلب سعر الرمز المحدد
   */
  async fetchPrice(symbol: string): Promise<number | null> {
    // التحقق من تجاوز حد معدل الاستخدام
    if (this.rateLimit.isRateLimited()) {
      return this.handleRateLimitedFetch(symbol);
    }
    
    // التحقق من الذاكرة المؤقتة أولاً
    const cachedPrice = this.cache.get(symbol);
    if (cachedPrice !== null) return cachedPrice;

    console.log('بدء محاولة جلب السعر للرمز', symbol);
    
    try {
      // استخدام وظيفة إعادة المحاولة
      const price = await this.fetchPriceWithRetry(symbol);
      
      if (price !== null) {
        this.handleSuccessfulFetch(symbol, price);
      }
      
      return price;
    } catch (error) {
      return this.handleFetchError(symbol, error as Error);
    }
  }

  /**
   * التعامل مع حالة تجاوز حد معدل الاستخدام
   */
  private handleRateLimitedFetch(symbol: string): number | null {
    // محاولة استخدام السعر المخزن مؤقتًا
    const cachedPrice = this.cache.get(symbol);
    if (cachedPrice !== null) return cachedPrice;
    
    throw new Error('تم تجاوز حد معدل API');
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
   * التعامل مع نجاح جلب السعر
   */
  private handleSuccessfulFetch(symbol: string, price: number): void {
    this.cache.set(symbol, price);
    
    // إشعار المشتركين بالسعر الجديد
    this.subscriptions.notifySubscribers(symbol, price);
  }

  /**
   * التعامل مع خطأ جلب السعر
   */
  private handleFetchError(symbol: string, error: Error): never {
    console.error(`خطأ في fetchPrice للرمز ${symbol}:`, error);
    
    // التحقق مما إذا كان الخطأ متعلقًا بحد معدل الاستخدام
    if (error.message.includes('rate limit')) {
      this.rateLimit.setRateLimited(true);
    }
    
    // إشعار المشتركين بالخطأ
    this.subscriptions.notifyError(symbol, error);
    
    throw error;
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
