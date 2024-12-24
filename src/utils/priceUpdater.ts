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
  private lastPrices: Map<string, { price: number; timestamp: number }> = new Map();
  private apiKey: string = "3P42SPLIYAP6IOZ3";
  private baseUrl: string = "https://www.alphavantage.co/query";

  async fetchPrice(symbol: string): Promise<number> {
    try {
      console.log(`جاري جلب السعر الحقيقي للعملة ${symbol}`);

      // Check cache first (valid for 1 minute)
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < 60000) {
        console.log(`استخدام السعر المخزن للعملة ${symbol}: ${cached.price}`);
        return cached.price;
      }

      let endpoint: string;
      let params: any;

      if (symbol === 'XAUUSD') {
        endpoint = 'CURRENCY_EXCHANGE_RATE';
        params = {
          function: endpoint,
          from_currency: 'XAU',
          to_currency: 'USD',
          apikey: this.apiKey
        };
      } else if (symbol.length === 6) {
        // Forex pairs
        endpoint = 'CURRENCY_EXCHANGE_RATE';
        params = {
          function: endpoint,
          from_currency: symbol.slice(0, 3),
          to_currency: symbol.slice(3, 6),
          apikey: this.apiKey
        };
      } else {
        // For other symbols like indices, use GLOBAL_QUOTE
        endpoint = 'GLOBAL_QUOTE';
        params = {
          function: endpoint,
          symbol: symbol,
          apikey: this.apiKey
        };
      }

      const response = await axios.get(this.baseUrl, { params });
      let price: number;

      if (response.data['Realtime Currency Exchange Rate']) {
        price = Number(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      } else if (response.data['Global Quote']) {
        price = Number(response.data['Global Quote']['05. price']);
      } else {
        console.warn(`لم يتم العثور على سعر حقيقي للعملة ${symbol}، استخدام سعر محاكي`);
        return this.getSimulatedPrice(symbol);
      }

      if (!price || isNaN(price)) {
        throw new Error(`سعر غير صالح للعملة ${symbol}`);
      }

      console.log(`تم جلب السعر الحقيقي للعملة ${symbol}: ${price}`);
      this.lastPrices.set(symbol, { price, timestamp: Date.now() });
      return price;

    } catch (error) {
      console.error(`خطأ في جلب السعر للعملة ${symbol}:`, error);
      return this.getSimulatedPrice(symbol);
    }
  }

  private getSimulatedPrice(symbol: string): number {
    const basePrice = this.getBasePrice(symbol);
    const variation = basePrice * 0.0002 * (Math.random() - 0.5);
    const lastPrice = this.lastPrices.get(symbol)?.price || basePrice;
    const newPrice = Number((lastPrice + variation).toFixed(2));
    
    this.lastPrices.set(symbol, { price: newPrice, timestamp: Date.now() });
    console.log(`استخدام سعر محاكي للعملة ${symbol}: ${newPrice}`);
    return newPrice;
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'XAUUSD': 2022.50,
      'EURUSD': 1.0925,
      'GBPUSD': 1.2715,
      'USDJPY': 142.50,
      'BTCUSD': 42150.75,
      'ETHUSD': 2245.30,
      'US30': 37500.80,
      'US100': 16750.80,
      'US500': 4750.60,
      'USOIL': 72.50,
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