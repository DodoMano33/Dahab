import { fetchCryptoPrice, fetchForexPrice } from './api';

class PriceUpdater {
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private CACHE_DURATION = 5000; // 5 seconds
  private MAX_RETRIES = 3;
  private RETRY_DELAY = 1000; // 1 second

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async retry<T>(fn: () => Promise<T>, retries = this.MAX_RETRIES): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.retry(fn, retries - 1);
      }
      console.error("Max retries reached:", error);
      return null;
    }
  }

  async fetchPrice(symbol: string): Promise<number | null> {
    try {
      console.log(`Attempting to fetch price for symbol: ${symbol}`);

      // Check cache first
      const cached = this.priceCache.get(symbol);
      if (cached && this.isCacheValid(cached.timestamp)) {
        console.log(`Using cached price for ${symbol}:`, cached.price);
        return cached.price;
      }

      let price: number | null = null;

      // Try crypto first with retries
      try {
        price = await this.retry(async () => {
          const cryptoPrice = await fetchCryptoPrice(symbol);
          if (cryptoPrice && cryptoPrice > 0) return cryptoPrice;
          throw new Error('Invalid crypto price');
        });
      } catch (error) {
        console.log(`Failed to fetch crypto price for ${symbol}, trying forex...`);
      }

      // If crypto fails, try forex with retries
      if (!price) {
        try {
          price = await this.retry(async () => {
            const forexPrice = await fetchForexPrice(symbol);
            if (forexPrice && forexPrice > 0) return forexPrice;
            throw new Error('Invalid forex price');
          });
        } catch (error) {
          console.log(`Failed to fetch forex price for ${symbol}`);
        }
      }

      if (price && !isNaN(price) && price > 0) {
        // Update cache
        this.priceCache.set(symbol, { price, timestamp: Date.now() });
        console.log(`Successfully fetched and cached price for ${symbol}:`, price);
        return price;
      }

      console.log(`No valid price found for ${symbol}`);
      return null;

    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  }
}

export const priceUpdater = new PriceUpdater();