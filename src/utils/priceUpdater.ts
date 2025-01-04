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
      console.log(`جاري جلب السعر للرمز ${symbol}`);

      if (!symbol) {
        throw new Error("الرمز غير صالح");
      }

      // التحقق من الذاكرة المؤقتة (صالحة لمدة 5 ثوانٍ)
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < 5000) {
        console.log(`استخدام السعر المخزن للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      // تحديد نوع الرمز وتكوين نقطة النهاية المناسبة
      let endpoint: string;
      let queryParams: any = {};
      
      if (symbol === 'XAUUSD') {
        endpoint = `/forex/candle`;
        queryParams = {
          symbol: 'OANDA:XAU_USD',
          resolution: 'D',
          count: 1
        };
      } else if (symbol.includes('USD')) {
        endpoint = `/forex/candle`;
        const base = symbol.slice(0, 3);
        const quote = symbol.slice(3);
        queryParams = {
          symbol: `OANDA:${base}_${quote}`,
          resolution: 'D',
          count: 1
        };
      } else {
        endpoint = `/quote`;
        queryParams = { symbol };
      }

      const response = await axios.get(`https://finnhub.io/api/v1${endpoint}`, {
        params: queryParams,
        headers: {
          'X-Finnhub-Token': this.finnhubApiKey
        },
        timeout: 10000 // 10 seconds timeout
      });

      let price: number;

      if (endpoint === '/forex/candle') {
        // للفوركس، نستخدم آخر سعر إغلاق
        if (response.data.c && response.data.c.length > 0) {
          price = response.data.c[response.data.c.length - 1];
        } else {
          throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
        }
      } else {
        // للأسهم والرموز الأخرى
        if (response.data.c) {
          price = response.data.c;
        } else {
          throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
        }
      }

      if (!price || isNaN(price)) {
        throw new Error(`سعر غير صالح للرمز ${symbol}`);
      }

      console.log(`تم جلب السعر للرمز ${symbol}: ${price}`);
      this.lastPrices.set(symbol, { price, timestamp: Date.now() });
      return price;

    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('انتهت مهلة الاتصال. الرجاء المحاولة مرة أخرى.');
        }
        if (error.response?.status === 403) {
          throw new Error('خطأ في المصادقة. الرجاء التحقق من مفتاح API.');
        }
        if (error.response?.status === 429) {
          throw new Error('تم تجاوز حد الطلبات. الرجاء المحاولة لاحقاً.');
        }
      }
      throw new Error('فشل في جلب السعر. الرجاء التحقق من صحة الرمز والمحاولة مرة أخرى.');
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
