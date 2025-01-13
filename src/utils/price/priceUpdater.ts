import { fetchCryptoPrice, fetchForexPrice } from './api';

class PriceUpdater {
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private CACHE_DURATION = 5000; // 5 seconds

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
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

      // Try crypto first
      try {
        price = await fetchCryptoPrice(symbol);
      } catch (error) {
        console.log(`Failed to fetch crypto price for ${symbol}, trying forex...`);
      }

      // If crypto fails, try forex
      if (!price) {
        try {
          price = await fetchForexPrice(symbol);
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