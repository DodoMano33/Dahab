import { PriceSubscription, CachedPrice } from './types';
import { POLLING_INTERVAL, CACHE_DURATION, SUPPORTED_SYMBOLS } from './config';
import { fetchForexPrice, fetchQuotePrice } from './api';

class PriceUpdater {
  private subscriptions: Map<string, PriceSubscription[]> = new Map();
  private polling: boolean = false;
  private intervalId?: NodeJS.Timeout;
  private lastPrices: Map<string, CachedPrice> = new Map();

  async fetchPrice(symbol: string): Promise<number> {
    try {
      console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

      if (!symbol || !SUPPORTED_SYMBOLS.includes(symbol as any)) {
        throw new Error(`الرمز ${symbol} غير مدعوم`);
      }

      // التحقق من الذاكرة المؤقتة
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`استخدام السعر المخزن للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      let price: number;
      if (symbol.includes('USD')) {
        price = await fetchForexPrice(symbol);
      } else {
        price = await fetchQuotePrice(symbol);
      }

      if (!price || isNaN(price)) {
        throw new Error(`سعر غير صالح للرمز ${symbol}`);
      }

      console.log(`تم جلب السعر بنجاح للرمز ${symbol}: ${price}`);
      this.lastPrices.set(symbol, { price, timestamp: Date.now() });
      return price;

    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error('خطأ في المصادقة مع Finnhub API. يرجى التحقق من صلاحية المفتاح.');
        }
        if (error.response?.status === 429) {
          throw new Error('تم تجاوز حد الطلبات. يرجى المحاولة بعد دقيقة.');
        }
      }
      throw error;
    }
  }

  subscribe(subscription: PriceSubscription) {
    const { symbol } = subscription;
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, []);
    }
    this.subscriptions.get(symbol)?.push(subscription);

    if (!this.polling) {
      this.startPolling();
    }

    this.fetchPrice(symbol)
      .then(price => subscription.onUpdate(price))
      .catch(error => subscription.onError(error));
  }

  unsubscribe(symbol: string, onUpdate: (price: number) => void) {
    const subs = this.subscriptions.get(symbol);
    if (subs) {
      const index = subs.findIndex(sub => sub.onUpdate === onUpdate);
      if (index !== -1) {
        subs.splice(index, 1);
      }
      if (subs.length === 0) {
        this.subscriptions.delete(symbol);
        this.lastPrices.delete(symbol);
      }
    }

    if (this.subscriptions.size === 0) {
      this.stopPolling();
    }
  }

  private async updatePrices() {
    for (const [symbol, subs] of this.subscriptions.entries()) {
      try {
        const price = await this.fetchPrice(symbol);
        subs.forEach(sub => sub.onUpdate(price));
      } catch (error) {
        subs.forEach(sub => sub.onError(error as Error));
      }
    }
  }

  private startPolling() {
    if (!this.polling) {
      this.polling = true;
      this.updatePrices();
      this.intervalId = setInterval(() => this.updatePrices(), POLLING_INTERVAL);
    }
  }

  private stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.polling = false;
  }
}

export const priceUpdater = new PriceUpdater();