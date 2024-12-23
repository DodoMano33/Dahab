import { toast } from "sonner";

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

  async fetchPrice(symbol: string): Promise<number> {
    try {
      console.log(`جاري جلب السعر للعملة ${symbol}`);
      
      // محاكاة طلب API حقيقي - في الإنتاج، استبدل هذا بطلب API فعلي
      const mockPrices: { [key: string]: number } = {
        'XAUUSD': 2023.50,
        'BTCUSD': 42150.75,
        'ETHUSD': 2245.30,
        'EURUSD': 1.0925,
        'GBPUSD': 1.2715,
        'BNBUSD': 245.60,
        'SOLUSD': 108.25,
        'US100': 16750.80
      };

      const basePrice = mockPrices[symbol] || 100;
      const randomVariation = (Math.random() - 0.5) * 0.001 * basePrice;
      const price = Number((basePrice + randomVariation).toFixed(2));
      
      console.log(`تم جلب السعر للعملة ${symbol}: ${price}`);
      return price;
    } catch (error) {
      console.error(`خطأ في جلب السعر للعملة ${symbol}:`, error);
      throw new Error(`فشل في جلب السعر للعملة ${symbol}`);
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