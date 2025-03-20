import { fetchPrice } from './api';

/**
 * يستخدم هذا الملف كوسيط لتحديث الأسعار في التطبيق
 */

class PriceUpdater {
  private subscribers: Map<string, Array<(price: number) => void>> = new Map();
  private errorHandlers: Map<string, Array<(error: Error) => void>> = new Map();
  private lastPrices: Map<string, number> = new Map();
  private isPolling: Map<string, boolean> = new Map();
  
  /**
   * تحديث المشتركين بالسعر الجديد
   */
  private notifySubscribers(symbol: string, price: number) {
    const handlers = this.subscribers.get(symbol) || [];
    handlers.forEach(handler => {
      try {
        handler(price);
      } catch (error) {
        console.error(`خطأ في معالج تحديث السعر للرمز ${symbol}:`, error);
      }
    });
    
    // تخزين آخر سعر
    this.lastPrices.set(symbol, price);
  }
  
  /**
   * إشعار المشتركين بالخطأ
   */
  private notifyErrorHandlers(symbol: string, error: Error) {
    const handlers = this.errorHandlers.get(symbol) || [];
    handlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error(`خطأ في معالج أخطاء السعر للرمز ${symbol}:`, handlerError);
      }
    });
  }
  
  /**
   * جلب أحدث سعر للرمز
   */
  public async fetchPrice(symbol: string): Promise<number | null> {
    try {
      // جلب السعر مباشرة من API
      const price = await fetchPrice(symbol);
      
      if (price !== null) {
        // تحديث المشتركين
        this.notifySubscribers(symbol, price);
        return price;
      }
      
      return null;
    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      this.notifyErrorHandlers(symbol, error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }
  
  /**
   * الحصول على آخر سعر معروف للرمز
   */
  public getLastPrice(symbol: string): number | null {
    return this.lastPrices.get(symbol) || null;
  }
  
  /**
   * الاشتراك في تحديثات السعر
   */
  public subscribe(options: {
    symbol: string;
    onUpdate: (price: number) => void;
    onError?: (error: Error) => void;
  }): void {
    const { symbol, onUpdate, onError } = options;
    
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    
    this.subscribers.get(symbol)!.push(onUpdate);
    
    if (onError) {
      if (!this.errorHandlers.has(symbol)) {
        this.errorHandlers.set(symbol, []);
      }
      
      this.errorHandlers.get(symbol)!.push(onError);
    }
    
    // إذا كان لدينا سعر مخزن، نرسله فورًا
    const lastPrice = this.lastPrices.get(symbol);
    if (lastPrice !== undefined) {
      onUpdate(lastPrice);
    }
  }
  
  /**
   * إلغاء الاشتراك من تحديثات السعر
   */
  public unsubscribe(symbol: string, handler: (price: number) => void): void {
    if (!this.subscribers.has(symbol)) {
      return;
    }
    
    const handlers = this.subscribers.get(symbol)!;
    const index = handlers.indexOf(handler);
    
    if (index !== -1) {
      handlers.splice(index, 1);
    }
    
    if (handlers.length === 0) {
      this.subscribers.delete(symbol);
      this.stopPolling(symbol);
    }
  }
  
  /**
   * إيقاف عملية الاستطلاع للرمز
   */
  private stopPolling(symbol: string): void {
    this.isPolling.set(symbol, false);
  }
}

export const priceUpdater = new PriceUpdater();
