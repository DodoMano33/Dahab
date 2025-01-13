import axios from "axios";
import { ALPHA_VANTAGE_API_KEY } from './config';

interface PriceSubscription {
  symbol: string;
  onUpdate: (price: number) => void;
  onError: (error: Error) => void;
}

class PriceUpdater {
  private subscriptions: Map<string, PriceSubscription[]> = new Map();
  private polling: boolean = false;
  private pollingInterval: number = 5000; // 5 seconds
  private intervalId?: NodeJS.Timeout;
  private lastPrices: Map<string, { price: number; timestamp: number }> = new Map();

  async fetchPrice(symbol: string, providedPrice?: number): Promise<number> {
    try {
      console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

      if (!symbol) {
        throw new Error("الرمز غير صالح");
      }

      // إذا تم توفير سعر، استخدمه مباشرة
      if (providedPrice !== undefined && providedPrice > 0) {
        console.log(`استخدام السعر المقدم للرمز ${symbol}: ${providedPrice}`);
        this.lastPrices.set(symbol, { price: providedPrice, timestamp: Date.now() });
        return providedPrice;
      }

      // التحقق من الذاكرة المؤقتة (صالحة لمدة 5 ثوانٍ)
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < 5000) {
        console.log(`استخدام السعر المخزن للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      // إذا لم يتم توفير سعر ولا يوجد سعر مخزن، نرجع 0
      console.log(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
      return 0;

    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      throw error;
    }
  }

  subscribe(subscription: PriceSubscription, providedPrice?: number) {
    const { symbol } = subscription;
    console.log(`اشتراك جديد للرمز ${symbol}`);
    
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, []);
    }
    this.subscriptions.get(symbol)?.push(subscription);

    // جلب السعر الأولي باستخدام السعر المقدم
    this.fetchPrice(symbol, providedPrice)
      .then(price => {
        if (price > 0) {
          console.log(`تم جلب السعر الأولي للرمز ${symbol}: ${price}`);
          subscription.onUpdate(price);
        } else {
          console.log(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
          subscription.onError(new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً"));
        }
      })
      .catch(error => {
        console.error(`خطأ في جلب السعر الأولي للرمز ${symbol}:`, error);
        subscription.onError(error);
      });
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
        this.lastPrices.delete(symbol);
        console.log(`تم حذف جميع الاشتراكات للرمز ${symbol}`);
      }
    }
  }
}

export const priceUpdater = new PriceUpdater();