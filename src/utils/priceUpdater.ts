import axios from "axios";

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
  private lastPrices: Map<string, number> = new Map();
  private apiUrl: string = "https://www.alphavantage.co/query";
  private apiKey: string = "demo"; // Using demo key for now

  async fetchPrice(symbol: string): Promise<number> {
    try {
      console.log(`جاري جلب السعر الحقيقي للعملة ${symbol}`);

      // Check if we have a recent price to avoid API rate limits
      const lastPrice = this.lastPrices.get(symbol);
      if (lastPrice && Date.now() - (this.lastPrices.get(`${symbol}_timestamp`) || 0) < 60000) {
        return lastPrice;
      }

      // Convert symbol to Alpha Vantage format
      const from_currency = symbol.slice(0, 3);
      const to_currency = symbol.slice(3, 6);

      // Special handling for commodities and indices
      let endpoint;
      let params;
      
      if (symbol === 'XAUUSD') {
        endpoint = 'CURRENCY_EXCHANGE_RATE';
        params = {
          function: endpoint,
          from_currency: 'XAU',
          to_currency: 'USD',
          apikey: this.apiKey
        };
      } else if (['US30', 'US100', 'US500'].includes(symbol)) {
        // For indices, fallback to simulated data for now
        return this.getSimulatedPrice(symbol);
      } else {
        endpoint = 'CURRENCY_EXCHANGE_RATE';
        params = {
          function: endpoint,
          from_currency,
          to_currency,
          apikey: this.apiKey
        };
      }

      const response = await axios.get(this.apiUrl, { params });
      
      if (!response.data || response.data['Error Message']) {
        console.warn(`استخدام سعر محاكي للعملة ${symbol} بسبب قيود API`);
        return this.getSimulatedPrice(symbol);
      }

      const price = Number(response.data['Realtime Currency Exchange Rate']?.['5. Exchange Rate']);
      
      if (!price || isNaN(price)) {
        console.warn(`استخدام سعر محاكي للعملة ${symbol} بسبب عدم توفر السعر`);
        return this.getSimulatedPrice(symbol);
      }

      console.log(`تم جلب السعر الحقيقي للعملة ${symbol}: ${price}`);
      
      this.lastPrices.set(symbol, price);
      this.lastPrices.set(`${symbol}_timestamp`, Date.now());
      return price;

    } catch (error) {
      console.error(`خطأ في جلب السعر للعملة ${symbol}:`, error);
      console.warn(`استخدام سعر محاكي للعملة ${symbol}`);
      return this.getSimulatedPrice(symbol);
    }
  }

  private getSimulatedPrice(symbol: string): number {
    const basePrice = this.lastPrices.get(symbol) || this.getInitialPrice(symbol);
    const maxVariation = basePrice * 0.0002;
    const randomVariation = (Math.random() - 0.5) * maxVariation;
    const newPrice = Number((basePrice + randomVariation).toFixed(2));
    
    this.lastPrices.set(symbol, newPrice);
    return newPrice;
  }

  private getInitialPrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'XAUUSD': 2022.50,  // الذهب
      'EURUSD': 1.0925,   // اليورو
      'GBPUSD': 1.2715,   // الباوند
      'USDJPY': 142.50,   // الين
      'BTCUSD': 42150.75, // البيتكوين
      'ETHUSD': 2245.30,  // الإيثريوم
      'US30': 37500.80,   // داو جونز
      'US100': 16750.80,  // ناسداك
      'US500': 4750.60,   // S&P 500
      'USOIL': 72.50,     // النفط
    };

    return basePrices[symbol] || 100;
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

    // Fetch initial price
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
        console.error(`خطأ في تحديث السعر للعملة ${symbol}:`, error);
        subs.forEach(sub => sub.onError(error as Error));
      }
    }
  }

  private startPolling() {
    if (!this.polling) {
      this.polling = true;
      this.updatePrices();
      this.intervalId = setInterval(() => this.updatePrices(), this.pollingInterval);
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