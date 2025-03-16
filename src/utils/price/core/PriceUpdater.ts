
import { fetchCryptoPrice, fetchForexPrice, fetchGoldPrice } from '../api';

export class PriceUpdater {
  private rateLimitHit: boolean = false;
  private lastRateLimitTime: number = 0;
  private readonly RATE_LIMIT_RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours
  private goldPriceUpdateInterval: number | null = null;
  private lastGoldPriceUpdate: number = 0;
  private cachedGoldPrice: number | null = null;

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

  getLastGoldPrice(): number | null {
    return this.cachedGoldPrice;
  }
  
  getLastUpdateTime(): number {
    return this.lastGoldPriceUpdate;
  }

  setCachedGoldPrice(price: number): void {
    this.cachedGoldPrice = price;
    this.lastGoldPriceUpdate = Date.now();
  }

  async fetchPrice(symbol: string): Promise<number | null> {
    if (symbol.toUpperCase().includes('XAU') || symbol.toUpperCase().includes('GOLD')) {
      return await this.retry(fetchGoldPrice);
    }
    
    if (this.isRateLimited()) {
      throw new Error('API rate limit reached');
    }

    console.log('Attempting to fetch price for symbol:', symbol);
    
    try {
      try {
        const cryptoPrice = await this.retry(async () => {
          console.log('Fetching crypto price for', symbol.toLowerCase(), '...');
          return await fetchCryptoPrice(symbol.toLowerCase());
        });
        return cryptoPrice;
      } catch (error) {
        console.log('Failed to fetch crypto price, trying forex...');
      }

      try {
        const forexPrice = await this.retry(async () => {
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
}
