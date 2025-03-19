
import { fetchCryptoPrice, fetchForexPrice, fetchGoldPrice } from './price/api';

interface PriceSubscription {
  symbol: string;
  onUpdate: (price: number) => void;
  onError: (error: Error) => void;
}

class PriceUpdater {
  private subscriptions: Map<string, PriceSubscription[]> = new Map();
  private polling: boolean = false;
  private pollingInterval: number = 300000; // 5 دقائق بدلاً من 5 ثوان
  private intervalId?: NodeJS.Timeout;
  private lastPrices: Map<string, { price: number; timestamp: number }> = new Map();
  private rateLimited: boolean = false;
  private rateLimitTimestamp: number = 0;
  private RATE_LIMIT_DURATION = 24 * 60 * 60 * 1000; // 24 ساعة

  async fetchPrice(symbol: string, providedPrice?: number): Promise<number | null> {
    try {
      console.log(`بدء محاولة جلب السعر للرمز ${symbol} من Metal Price API`);

      if (!symbol) {
        throw new Error("الرمز غير صالح");
      }

      // إذا تم توفير سعر، استخدمه مباشرة
      if (providedPrice !== undefined) {
        console.log(`استخدام السعر المقدم للرمز ${symbol}: ${providedPrice}`);
        this.lastPrices.set(symbol, { price: providedPrice, timestamp: Date.now() });
        return providedPrice;
      }

      // التحقق من الذاكرة المؤقتة (صالحة لمدة 5 دقائق)
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < 300000) {
        console.log(`استخدام السعر المخزن مؤقتًا للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      // التحقق من حالة حد معدل الاستخدام
      if (this.rateLimited && Date.now() - this.rateLimitTimestamp < this.RATE_LIMIT_DURATION) {
        console.log(`تم تجاوز حد معدل API للرمز ${symbol}`);
        return null;
      } else if (this.rateLimited) {
        // إعادة ضبط حالة حد معدل الاستخدام بعد انقضاء المدة
        this.rateLimited = false;
      }

      // محاولة جلب السعر من Metal Price API
      let price = null;
      
      // معالجة خاصة للذهب
      if (symbol.toUpperCase() === 'XAUUSD' || symbol.toUpperCase() === 'GOLD' || symbol.toUpperCase() === 'XAU') {
        price = await fetchGoldPrice();
      } 
      // محاولة جلب سعر العملات المشفرة
      else if (['BTC', 'ETH', 'BTCUSDT'].includes(symbol.toUpperCase())) {
        price = await fetchCryptoPrice(symbol.toUpperCase());
      } 
      // محاولة جلب سعر الفوركس
      else {
        price = await fetchForexPrice(symbol.toUpperCase());
      }

      if (price !== null) {
        console.log(`تم جلب السعر من Metal Price API للرمز ${symbol}: ${price}`);
        this.lastPrices.set(symbol, { price, timestamp: Date.now() });
        
        // إرسال حدث تحديث السعر
        window.dispatchEvent(new CustomEvent('metal-price-update', {
          detail: { price, symbol }
        }));
        
        return price;
      }

      // إذا لم يتم العثور على سعر، استخدم آخر سعر معروف أو null
      if (cached) {
        console.log(`لم يتم العثور على سعر جديد للرمز ${symbol}، استخدام آخر سعر مخزن: ${cached.price}`);
        return cached.price;
      }
      
      console.log(`لم يتم العثور على سعر للرمز ${symbol}`);
      return null;
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      
      // في حالة الخطأ، نستخدم آخر سعر معروف أو null
      const cached = this.lastPrices.get(symbol);
      if (cached) {
        return cached.price;
      }
      
      return null;
    }
  }

  subscribe(subscription: PriceSubscription, providedPrice?: number) {
    const { symbol } = subscription;
    console.log(`اشتراك جديد للرمز ${symbol}`);
    
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, []);
    }
    this.subscriptions.get(symbol)?.push(subscription);

    // جلب السعر الأولي
    this.fetchPrice(symbol, providedPrice)
      .then(price => {
        if (price !== null) {
          console.log(`تم جلب السعر الأولي للرمز ${symbol}: ${price}`);
          subscription.onUpdate(price);
        } else {
          console.error(`لم يتم العثور على سعر أولي للرمز ${symbol}`);
          subscription.onError(new Error(`لم يتم العثور على سعر للرمز ${symbol}`));
        }
      })
      .catch(error => {
        console.error(`خطأ في جلب السعر الأولي للرمز ${symbol}:`, error);
        subscription.onError(error);
      });
      
    // بدء التحديث الدوري إذا لم يكن قد بدأ بالفعل
    this.startPolling();
  }

  unsubscribe(symbol: string, onUpdate: (price: number) => void) {
    console.log(`إلغاء اشتراك للرمز ${symbol}`);
    
    const subs = this.subscriptions.get(symbol);
    if (subs) {
      const index = subs.findIndex(sub => sub.onUpdate === onUpdate);
      if (index !== -1) {
        subs.splice(index, 1);
        console.log(`تم إلغاء الاشتراك بنجاح للرمز ${symbol}`);
      }
      if (subs.length === 0) {
        this.subscriptions.delete(symbol);
        console.log(`تم حذف جميع الاشتراكات للرمز ${symbol}`);
      }
    }
    
    // إيقاف التحديث الدوري إذا لم تعد هناك اشتراكات
    if (this.subscriptions.size === 0) {
      this.stopPolling();
    }
  }
  
  private startPolling() {
    if (this.polling) return;
    
    console.log("بدء التحديث الدوري للأسعار من Metal Price API");
    this.polling = true;
    
    this.intervalId = setInterval(async () => {
      for (const [symbol, subs] of this.subscriptions.entries()) {
        try {
          const price = await this.fetchPrice(symbol);
          if (price !== null) {
            subs.forEach(sub => sub.onUpdate(price));
          } else {
            subs.forEach(sub => sub.onError(new Error(`لم يتم العثور على سعر للرمز ${symbol}`)));
          }
        } catch (error) {
          console.error(`خطأ في تحديث السعر للرمز ${symbol}:`, error);
          subs.forEach(sub => sub.onError(error as Error));
        }
      }
    }, this.pollingInterval);
  }
  
  private stopPolling() {
    if (!this.polling) return;
    
    console.log("إيقاف التحديث الدوري للأسعار");
    this.polling = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}

export const priceUpdater = new PriceUpdater();
