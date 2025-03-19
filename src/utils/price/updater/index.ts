
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
      // محاولة استخدام السعر المخزن مؤقتًا
      const cachedPrice = this.cache.get(symbol);
      if (cachedPrice !== null) return cachedPrice;
      
      throw new Error('تم تجاوز حد معدل API');
    }
    
    // التحقق من الذاكرة المؤقتة أولاً
    const cachedPrice = this.cache.get(symbol);
    if (cachedPrice !== null) return cachedPrice;

    console.log('بدء محاولة جلب السعر للرمز', symbol);
    
    try {
      // استخدام وظيفة إعادة المحاولة
      const price = await retry(
        async () => {
          const result = await fetchPrice(symbol);
          return result;
        },
        this.retryOptions
      );
      
      if (price !== null) {
        this.cache.set(symbol, price);
        
        // إشعار المشتركين بالسعر الجديد
        this.subscriptions.notifySubscribers(symbol, price);
      }
      
      return price;
    } catch (error) {
      console.error(`خطأ في fetchPrice للرمز ${symbol}:`, error);
      
      // التحقق مما إذا كان الخطأ متعلقًا بحد معدل الاستخدام
      if (error instanceof Error && error.message.includes('rate limit')) {
        this.rateLimit.setRateLimited(true);
      }
      
      // إشعار المشتركين بالخطأ
      this.subscriptions.notifyError(symbol, error as Error);
      
      throw error;
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
