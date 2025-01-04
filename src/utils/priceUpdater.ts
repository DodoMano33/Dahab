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
      console.log(`بدء محاولة جلب السعر للرمز ${symbol}`);

      if (!symbol) {
        throw new Error("الرمز غير صالح");
      }

      // التحقق من الذاكرة المؤقتة (صالحة لمدة 5 ثوانٍ)
      const cached = this.lastPrices.get(symbol);
      if (cached && Date.now() - cached.timestamp < 5000) {
        console.log(`استخدام السعر المخزن للرمز ${symbol}: ${cached.price}`);
        return cached.price;
      }

      // تحديد نوع الرمز وتكوين طلب API المناسب
      let endpoint = 'https://finnhub.io/api/v1';
      let url = '';
      let params: any = {};

      if (symbol === 'XAUUSD') {
        url = `${endpoint}/forex/candle`;
        params = {
          symbol: 'OANDA:XAU_USD',
          resolution: '1',
          count: 1,
          token: this.finnhubApiKey
        };
        console.log("استخدام نقطة نهاية الفوركس للذهب:", params);
      } else if (symbol.includes('USD')) {
        url = `${endpoint}/forex/candle`;
        const base = symbol.slice(0, 3);
        const quote = symbol.slice(3);
        params = {
          symbol: `OANDA:${base}_${quote}`,
          resolution: '1',
          count: 1,
          token: this.finnhubApiKey
        };
        console.log("استخدام نقطة نهاية الفوركس للعملات:", params);
      } else {
        url = `${endpoint}/quote`;
        params = {
          symbol: symbol,
          token: this.finnhubApiKey
        };
        console.log("استخدام نقطة نهاية الأسهم:", params);
      }

      console.log(`إرسال طلب إلى: ${url}`);
      const response = await axios.get(url, { params });
      console.log(`استلام استجابة من API:`, response.data);

      let price: number;

      if (url.includes('/forex/candle')) {
        if (response.data.c && response.data.c.length > 0) {
          price = response.data.c[response.data.c.length - 1];
          console.log(`تم استخراج سعر الفوركس: ${price}`);
        } else {
          throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
        }
      } else {
        if (response.data.c) {
          price = response.data.c;
          console.log(`تم استخراج سعر السهم: ${price}`);
        } else {
          throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
        }
      }

      if (!price || isNaN(price)) {
        throw new Error(`سعر غير صالح للرمز ${symbol}`);
      }

      console.log(`تم جلب السعر بنجاح للرمز ${symbol}: ${price}`);
      this.lastPrices.set(symbol, { price, timestamp: Date.now() });
      return price;

    } catch (error) {
      console.error(`خطأ في جلب السعر للرمز ${symbol}:`, error);
      
      if (axios.isAxiosError(error)) {
        console.log("تفاصيل خطأ Axios:", {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });

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
      throw new Error(`فشل في جلب السعر للرمز ${symbol}. ${error.message}`);
    }
  }

  subscribe(subscription: PriceSubscription) {
    const { symbol } = subscription;
    console.log(`اشتراك جديد للرمز ${symbol}`);
    
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, []);
    }
    this.subscriptions.get(symbol)?.push(subscription);

    if (!this.polling) {
      this.startPolling();
    }

    // جلب السعر الأولي
    this.fetchPrice(symbol)
      .then(price => {
        console.log(`تم جلب السعر الأولي للرمز ${symbol}: ${price}`);
        subscription.onUpdate(price);
      })
      .catch(error => {
        console.error(`خطأ في جلب السعر الأولي للرمز ${symbol}:`, error);
        subscription.onError(error);
      });
  }

  unsubscribe(symbol: string, onUpdate: (price: number) => void) {
    console.log(`إلغاء اشتراك للرمز ${symbol}`);
    
    const subs = this.subscriptions.get(symbol);
    if (subs) {
      const index = subs.findIndex(sub => sub.onUpdate === onUpdate);
      if (index !== -1) {
        subs.splice(index, 1);
        console.log(`تم إلغاء الاشتراك بنجاح للرمز ${symbol}`);
      }
      if (subs.length === 0) {
        this.subscriptions.delete(symbol);
        this.lastPrices.delete(symbol);
        console.log(`تم حذف جميع الاشتراكات للرمز ${symbol}`);
      }
    }

    if (this.subscriptions.size === 0) {
      this.stopPolling();
      console.log('تم إيقاف التحديث التلقائي لعدم وجود اشتراكات نشطة');
    }
  }

  private async updatePrices() {
    console.log('بدء تحديث الأسعار لجميع الاشتراكات النشطة');
    
    for (const [symbol, subs] of this.subscriptions.entries()) {
      try {
        const price = await this.fetchPrice(symbol);
        console.log(`تم تحديث السعر للرمز ${symbol}: ${price}`);
        subs.forEach(sub => sub.onUpdate(price));
      } catch (error) {
        console.error(`خطأ في تحديث السعر للرمز ${symbol}:`, error);
        subs.forEach(sub => sub.onError(error as Error));
      }
    }
  }

  private startPolling() {
    if (!this.polling) {
      console.log('بدء التحديث التلقائي للأسعار');
      this.polling = true;
      this.updatePrices();
      this.intervalId = setInterval(() => this.updatePrices(), this.pollingInterval);
    }
  }

  private stopPolling() {
    if (this.intervalId) {
      console.log('إيقاف التحديث التلقائي للأسعار');
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.polling = false;
  }
}

export const priceUpdater = new PriceUpdater();