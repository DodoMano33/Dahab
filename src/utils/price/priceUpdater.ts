
import { fetchCryptoPrice, fetchForexPrice, fetchGoldPrice } from './api';

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

  startGoldPriceUpdates(intervalMs: number = 10000) {
    this.stopGoldPriceUpdates();
    
    console.log(`بدء تحديثات سعر الذهب كل ${intervalMs}ms`);
    
    this.updateGoldPrice();
    
    this.goldPriceUpdateInterval = window.setInterval(() => {
      this.updateGoldPrice();
    }, intervalMs);
  }
  
  stopGoldPriceUpdates() {
    if (this.goldPriceUpdateInterval !== null) {
      clearInterval(this.goldPriceUpdateInterval);
      this.goldPriceUpdateInterval = null;
      console.log('تم إيقاف تحديثات سعر الذهب');
    }
  }
  
  private async updateGoldPrice() {
    try {
      if (this.isRateLimited()) {
        console.log('تم تجاوز حد معدل API، تجاوز تحديث سعر الذهب');
        return;
      }
      
      console.log('جاري تحديث سعر الذهب...');
      const price = await fetchGoldPrice();
      
      if (price !== null) {
        this.cachedGoldPrice = price;
        this.lastGoldPriceUpdate = Date.now();
        
        console.log(`تم تحديث سعر الذهب من Alpha Vantage: ${price}`);
        
        // تحديث السعر بجميع الأحداث المختلفة لضمان استقباله من قبل جميع المكونات
        
        // 1. تحديث بمصدر 'alphavantage' لإعطائه أولوية عالية
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { 
            price,
            symbol: 'CFI:XAUUSD',
            timestamp: Date.now(),
            source: 'alphavantage'
          }
        }));
        
        // 2. تحديث كاستجابة للسعر الحالي
        window.dispatchEvent(new CustomEvent('current-price-response', { 
          detail: { 
            price,
            symbol: 'CFI:XAUUSD',
            timestamp: Date.now(),
            source: 'alphavantage'
          }
        }));
        
        // 3. تحديث كسعر مباشر من الشارت
        window.dispatchEvent(new CustomEvent('chart-price-update', { 
          detail: { 
            price,
            symbol: 'CFI:XAUUSD',
            timestamp: Date.now(),
            source: 'alphavantage'
          }
        }));
      } else {
        console.log('فشل في الحصول على سعر الذهب من API');
      }
    } catch (error) {
      console.error('خطأ في تحديث سعر الذهب:', error);
      
      if (error instanceof Error && error.message.includes('rate limit')) {
        this.rateLimitHit = true;
        this.lastRateLimitTime = Date.now();
      }
    }
  }
  
  getLastGoldPrice(): number | null {
    return this.cachedGoldPrice;
  }
  
  getLastUpdateTime(): number {
    return this.lastGoldPriceUpdate;
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

export const priceUpdater = new PriceUpdater();

// الاستجابة لطلبات السعر الحالي - نضيف هذا المستمع هنا أيضًا للتأكيد
if (typeof window !== 'undefined') {
  window.addEventListener('request-current-price', () => {
    const lastPrice = priceUpdater.getLastGoldPrice();
    if (lastPrice !== null) {
      console.log('الاستجابة لطلب السعر الحالي من priceUpdater:', lastPrice);
      
      // إرسال بجميع أنواع الأحداث للتوافق مع جميع المكونات
      window.dispatchEvent(new CustomEvent('current-price-response', { 
        detail: { 
          price: lastPrice,
          symbol: 'CFI:XAUUSD',
          timestamp: Date.now(),
          source: 'alphavantage'
        }
      }));
      
      // إرسال لأحداث التحديث بمصدر alphavantage
      window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
        detail: { 
          price: lastPrice,
          symbol: 'CFI:XAUUSD',
          timestamp: Date.now(),
          source: 'alphavantage'
        }
      }));
    }
  });
}

// بدء تحديثات سعر الذهب بشكل أكثر تكرارًا (كل 5 ثوانٍ)
priceUpdater.startGoldPriceUpdates(5000);
