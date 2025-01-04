import { PriceSubscription, CachedPrice } from './types';
import { CACHE_DURATION, POLLING_INTERVAL, FOREX_SYMBOLS, CRYPTO_SYMBOLS } from './config';
import { fetchForexPrice, fetchCryptoPrice } from './api';

class PriceUpdater {
  private subscriptions: Map<string, PriceSubscription[]> = new Map();
  private polling: boolean = false;
  private intervalId?: NodeJS.Timeout;
  private lastPrices: Map<string, CachedPrice> = new Map();

  private isForexSymbol(symbol: string): boolean {
    return symbol in FOREX_SYMBOLS;
  }

  private isCryptoSymbol(symbol: string): boolean {
    return symbol in CRYPTO_SYMBOLS;
  }

  async fetchPrice(symbol: string): Promise<number> {
    try {
      console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

      // التحقق من الذاكرة المؤقتة
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`استخدام السعر المخزن للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      let price: number;
      if (this.isForexSymbol(symbol)) {
        price = await fetchForexPrice(symbol);
      } else if (this.isCryptoSymbol(symbol)) {
        price = await fetchCryptoPrice(symbol);
      } else {
        throw new Error(`الرمز ${symbol} غير مدعوم`);
      }

      this.lastPrices.set(symbol, { price, timestamp: Date.now() });
      return price;

    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      throw error;
    }
  }

  subscribe(subscription: PriceSubscription) {
    const { symbol } = subscription;
    console.log(`اشتراك جديد للرمز ${symbol}`);
    
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