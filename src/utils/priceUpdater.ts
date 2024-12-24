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

  async fetchPrice(symbol: string): Promise<number> {
    try {
      console.log(`جاري جلب السعر للعملة ${symbol}`);
      
      // أسعار أساسية أكثر دقة للعملات الشائعة
      const basePrice = this.lastPrices.get(symbol) || this.getInitialPrice(symbol);
      
      // تغير عشوائي صغير جداً (0.02% كحد أقصى)
      const maxVariation = basePrice * 0.0002;
      const randomVariation = (Math.random() - 0.5) * maxVariation;
      const newPrice = Number((basePrice + randomVariation).toFixed(2));
      
      this.lastPrices.set(symbol, newPrice);
      console.log(`تم جلب السعر للعملة ${symbol}: ${newPrice}`);
      return newPrice;
      
    } catch (error) {
      console.error(`خطأ في جلب السعر للعملة ${symbol}:`, error);
      throw new Error(`فشل في جلب السعر للعملة ${symbol}`);
    }
  }

  private getInitialPrice(symbol: string): number {
    // أسعار أساسية محدثة ودقيقة للعملات الرئيسية
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

    // جلب السعر الأولي فور الاشتراك
    this.fetchPrice(symbol)
      .then(price => subscription.onUpdate(price))
      .catch(error => subscription.onError(error as Error));
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