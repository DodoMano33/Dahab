
import { fetchCryptoPrice, fetchForexPrice, fetchGoldPrice } from './api';
import { POLLING_INTERVAL } from './config';

// سعر الذهب الافتراضي للحالات التي يفشل فيها الحصول على السعر
const DEFAULT_GOLD_PRICE = 2147.50;

export class PriceUpdater {
  private rateLimitHit: boolean = false;
  private lastRateLimitTime: number = 0;
  private readonly RATE_LIMIT_RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours
  private fetchInterval: number | null = null;

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

  async fetchGoldPrice(): Promise<number | null> {
    if (this.isRateLimited()) {
      console.warn('API rate limit has been reached. Using default gold price.');
      return DEFAULT_GOLD_PRICE;
    }

    try {
      return await this.retry(async () => {
        const price = await fetchGoldPrice();
        if (price) {
          // Dispatch event with the fetched price
          window.dispatchEvent(new CustomEvent('global-price-update', { 
            detail: { 
              price: price, 
              symbol: 'XAUUSD',
              source: 'Alpha Vantage API'
            }
          }));
        } else {
          // إذا فشل الحصول على سعر، استخدم السعر الافتراضي
          console.log(`Failed to fetch price, using default: ${DEFAULT_GOLD_PRICE}`);
          window.dispatchEvent(new CustomEvent('global-price-update', { 
            detail: { 
              price: DEFAULT_GOLD_PRICE, 
              symbol: 'XAUUSD',
              source: 'Default Fallback'
            }
          }));
          return DEFAULT_GOLD_PRICE;
        }
        return price;
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate limit')) {
        this.rateLimitHit = true;
        this.lastRateLimitTime = Date.now();
      }
      console.error('Failed to fetch gold price:', error);
      
      // استخدام السعر الافتراضي في حالة الخطأ
      console.log(`Error fetching gold price, using default: ${DEFAULT_GOLD_PRICE}`);
      window.dispatchEvent(new CustomEvent('global-price-update', { 
        detail: { 
          price: DEFAULT_GOLD_PRICE, 
          symbol: 'XAUUSD',
          source: 'Default Fallback (Error)'
        }
      }));
      return DEFAULT_GOLD_PRICE;
    }
  }

  async fetchPrice(symbol: string): Promise<number | null> {
    if (this.isRateLimited()) {
      if (symbol === 'XAUUSD') {
        console.log(`Rate limited for XAUUSD, using default: ${DEFAULT_GOLD_PRICE}`);
        return DEFAULT_GOLD_PRICE;
      }
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
        
        // إذا كان الرمز هو الذهب، استخدم السعر الافتراضي
        if (symbol === 'XAUUSD') {
          console.log(`No valid price found for XAUUSD, using default: ${DEFAULT_GOLD_PRICE}`);
          return DEFAULT_GOLD_PRICE;
        }
        return null;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate limit')) {
        this.rateLimitHit = true;
        this.lastRateLimitTime = Date.now();
      }
      
      // إذا كان الرمز هو الذهب، استخدم السعر الافتراضي
      if (symbol === 'XAUUSD') {
        console.log(`Error fetching XAUUSD, using default: ${DEFAULT_GOLD_PRICE}`);
        return DEFAULT_GOLD_PRICE;
      }
      throw error;
    }
  }

  startPricePolling() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
    }

    // Initial fetch
    this.fetchGoldPrice();

    // Set up interval for polling
    this.fetchInterval = setInterval(() => {
      this.fetchGoldPrice();
    }, POLLING_INTERVAL) as unknown as number;

    console.log('Started price polling with interval:', POLLING_INTERVAL, 'ms');
    
    return () => {
      if (this.fetchInterval) {
        clearInterval(this.fetchInterval);
        this.fetchInterval = null;
      }
    };
  }
}

export const priceUpdater = new PriceUpdater();
