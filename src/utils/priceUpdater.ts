
import { fetchCryptoPrice, fetchForexPrice } from './price/api';

class PriceUpdater {
  private rateLimitHit: boolean = false;
  private lastRateLimitTime: number = 0;
  private readonly RATE_LIMIT_RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours
  private customApiKey: string = '';

  getCustomApiKey(): string {
    return this.customApiKey;
  }

  setCustomApiKey(key: string): void {
    if (key && key.trim() !== '') {
      this.customApiKey = key.trim();
      console.log('تم تعيين مفتاح API مخصص');
    }
  }

  async retry<T>(fn: () => Promise<T>, maxAttempts: number = 3): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Retrying... ${maxAttempts - attempt + 1} attempts left`);
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (error instanceof Error && error.message.includes('rate limit')) {
          this.rateLimitHit = true;
          this.lastRateLimitTime = Date.now();
          throw error; // Don't retry if rate limited
        }
        if (attempt === maxAttempts) {
          console.error('Max retries reached:', { _type: 'Error', value: error });
          throw lastError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw lastError;
  }

  isRateLimited(): boolean {
    if (!this.rateLimitHit) return false;
    
    const now = Date.now();
    const timeSinceLimit = now - this.lastRateLimitTime;
    
    if (timeSinceLimit >= this.RATE_LIMIT_RESET_TIME) {
      this.rateLimitHit = false;
      return false;
    }
    
    return true;
  }

  async fetchPrice(symbol: string): Promise<number | null> {
    if (this.isRateLimited()) {
      throw new Error('API rate limit reached');
    }

    console.log('Attempting to fetch price for symbol:', symbol);
    
    try {
      // Try crypto first
      try {
        const cryptoPrice = await this.retry(async () => {
          console.log('Fetching crypto price for', symbol.toLowerCase(), '...');
          return await fetchCryptoPrice(symbol.toLowerCase());
        });
        return cryptoPrice;
      } catch (error) {
        console.log('Failed to fetch crypto price, trying forex...');
      }

      // Try forex as fallback
      try {
        const forexPrice = await this.retry(async () => {
          // Format forex symbol by ensuring it's 6 characters (e.g., EURUSD)
          const formattedSymbol = symbol.replace(/[^A-Z]/g, '').slice(0, 6);
          console.log('Fetching forex price for', formattedSymbol, '...');
          return await fetchForexPrice(formattedSymbol);
        });
        return forexPrice;
      } catch (error) {
        console.log('No valid price found for', symbol);
        return null;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate limit')) {
        this.rateLimitHit = true;
        this.lastRateLimitTime = Date.now();
      }
      throw error;
    }
  }

  // إضافة طريقة للاشتراك في تحديثات الأسعار
  private subscribers: Map<string, Function[]> = new Map();

  subscribe(symbol: string, callback: Function): void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)?.push(callback);
  }

  unsubscribe(symbol: string, callback: Function): void {
    if (!this.subscribers.has(symbol)) return;
    
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.subscribers.delete(symbol);
      }
    }
  }

  notifySubscribers(symbol: string, price: number): void {
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(price);
        } catch (error) {
          console.error('خطأ في استدعاء المشترك:', error);
        }
      });
    }
  }
}

export const priceUpdater = new PriceUpdater();
