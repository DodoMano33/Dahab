
import { PriceSubscription } from '../types';
import { PriceFetcher } from './fetcher';
import { PollingService } from './polling';
import { RateLimitManager } from './rateLimit';
import { SubscriptionService } from './subscriptions';
import { PriceUpdaterConfig, RetryOptions } from './types';

/**
 * محدث الأسعار - الفئة الرئيسية لإدارة تحديثات الأسعار والاشتراكات
 */
export class PriceUpdater {
  private rateLimit: RateLimitManager;
  private subscriptions: SubscriptionService;
  private fetcher: PriceFetcher;
  private polling: PollingService;

  constructor(config: Partial<PriceUpdaterConfig> = {}) {
    const {
      rateLimitResetTime = 24 * 60 * 60 * 1000, // 24 ساعة
      pollingInterval = 60000 // 1 دقيقة (تم تغييرها من 300000)
    } = config;
    
    this.rateLimit = new RateLimitManager(rateLimitResetTime);
    this.subscriptions = new SubscriptionService();
    
    this.fetcher = new PriceFetcher(
      this.rateLimit,
      {
        maxAttempts: 3,
        initialDelay: 1000
      }
    );
    
    this.polling = new PollingService(
      this.subscriptions,
      (symbol: string) => this.fetchPrice(symbol),
      pollingInterval
    );
  }

  /**
   * جلب سعر الرمز المحدد
   */
  async fetchPrice(symbol: string, providedPrice?: number): Promise<number | null> {
    return this.fetcher.fetchPrice(symbol, providedPrice);
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
    this.polling.start();
  }
  
  /**
   * إيقاف التحديث الدوري للأسعار
   */
  private stopPolling() {
    this.polling.stop();
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
    this.fetcher.setRetryOptions(options);
  }
}
