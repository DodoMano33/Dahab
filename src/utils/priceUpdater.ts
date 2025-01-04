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
  private finnhubApiKey: string = "ctlsb91r01qv7qq38es0ctlsb91r01qv7qq38esg";

  async fetchPrice(symbol: string): Promise<number> {
    try {
      console.log(`جاري جلب السعر من Finnhub للرمز ${symbol}`);

      // التحقق من الذاكرة المؤقتة (صالحة لمدة 5 ثوانٍ)
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < 5000) {
        console.log(`استخدام السعر المخزن للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      let endpoint: string;
      
      // تحديد نوع الرمز وتكوين نقطة النهاية المناسبة
      if (symbol === 'XAUUSD') {
        endpoint = `/quote?symbol=OANDA:XAU_USD`;
      } else if (symbol.includes('USD')) {
        const base = symbol.slice(0, 3);
        endpoint = `/forex/rates?base=${base}`;
      } else {
        endpoint = `/quote?symbol=${symbol}`;
      }

      const response = await axios.get(`https://finnhub.io/api/v1${endpoint}`, {
        headers: {
          'X-Finnhub-Token': this.finnhubApiKey
        }
      });

      let price: number;

      if (response.data.c) {
        price = response.data.c; // سعر الإغلاق الحالي
      } else if (response.data.quote) {
        price = response.data.quote;
      } else {
        throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
      }

      if (!price || isNaN(price)) {
        throw new Error(`سعر غير صالح للرمز ${symbol}`);
      }

      console.log(`تم جلب السعر من Finnhub للرمز ${symbol}: ${price}`);
      this.lastPrices.set(symbol, { price, timestamp: Date.now() });
      return price;

    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      throw error;
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

    // جلب السعر الأولي
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
        console.error(`خطأ في تحديث السعر للرمز ${symbol}:`, error);
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