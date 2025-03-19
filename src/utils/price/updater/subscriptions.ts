
import { PriceSubscription } from '../types';
import { SubscriptionManager } from './types';

export class SubscriptionService implements SubscriptionManager {
  private subscriptions: Record<string, Array<(price: number) => void>> = {};
  private errorHandlers: Record<string, Array<(error: Error) => void>> = {};

  /**
   * الاشتراك في تحديثات السعر للرمز المحدد
   */
  subscribe(subscription: PriceSubscription): void {
    const { symbol, onUpdate, onError } = subscription;
    
    if (!this.subscriptions[symbol]) {
      this.subscriptions[symbol] = [];
    }
    
    if (!this.errorHandlers[symbol]) {
      this.errorHandlers[symbol] = [];
    }
    
    // تجنب الاشتراكات المكررة
    if (!this.subscriptions[symbol].includes(onUpdate)) {
      this.subscriptions[symbol].push(onUpdate);
    }
    
    if (!this.errorHandlers[symbol].includes(onError)) {
      this.errorHandlers[symbol].push(onError);
    }
    
    console.log(`تم الاشتراك في تحديثات السعر للرمز ${symbol}`);
  }

  /**
   * إلغاء الاشتراك من تحديثات السعر للرمز المحدد
   */
  unsubscribe(symbol: string, callback: (price: number) => void): void {
    if (!this.subscriptions[symbol]) return;
    
    this.subscriptions[symbol] = this.subscriptions[symbol].filter(cb => cb !== callback);
    console.log(`تم إلغاء الاشتراك من تحديثات السعر للرمز ${symbol}`);
    
    // إزالة القائمة إذا لم يعد هناك مشتركين
    if (this.subscriptions[symbol].length === 0) {
      delete this.subscriptions[symbol];
      delete this.errorHandlers[symbol];
    }
  }

  /**
   * إرسال تحديث السعر لجميع المشتركين للرمز المحدد
   */
  notifySubscribers(symbol: string, price: number): void {
    if (!this.subscriptions[symbol]) return;
    
    for (const callback of this.subscriptions[symbol]) {
      try {
        callback(price);
      } catch (error) {
        console.error(`خطأ في معالج تحديث السعر للرمز ${symbol}:`, error);
      }
    }
  }

  /**
   * إرسال إشعار بالخطأ لجميع معالجات الأخطاء للرمز المحدد
   */
  notifyError(symbol: string, error: Error): void {
    if (!this.errorHandlers[symbol]) return;
    
    for (const handler of this.errorHandlers[symbol]) {
      try {
        handler(error);
      } catch (err) {
        console.error(`خطأ في معالج الخطأ للرمز ${symbol}:`, err);
      }
    }
  }

  /**
   * الحصول على قائمة الرموز المشترك بها
   */
  getSubscribedSymbols(): string[] {
    return Object.keys(this.subscriptions);
  }

  /**
   * التحقق مما إذا كان هناك مشتركون للرمز المحدد
   */
  hasSubscribers(symbol: string): boolean {
    return !!(this.subscriptions[symbol]?.length);
  }
}
