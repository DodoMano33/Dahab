
import { PriceUpdater } from '../core/PriceUpdater';
import { fetchGoldPrice } from '../api';
import { broadcastGoldPriceUpdate } from '../events/priceEventBroadcaster';

/**
 * مكون متخصص لتحديث سعر الذهب بشكل دوري
 */
export class GoldPriceUpdater {
  private updateInterval: number | null = null;
  private readonly priceUpdater: PriceUpdater;
  private useAlphaVantage: boolean = true;
  
  constructor(priceUpdater: PriceUpdater) {
    this.priceUpdater = priceUpdater;
  }
  
  start(intervalMs: number = 3000) {
    this.stop();
    
    console.log(`بدء تحديثات سعر الذهب كل ${intervalMs}ms`);
    
    // تحديث سعر الذهب مباشرة عند البدء
    this.updateGoldPrice();
    
    // بث السعر الحالي من الذاكرة المؤقتة حتى إذا لم يتغير
    const broadcastIntervalMs = Math.min(intervalMs / 2, 2000);
    setInterval(() => {
      const cachedPrice = this.priceUpdater.getLastGoldPrice();
      if (cachedPrice !== null) {
        console.log(`إعادة بث السعر المخزن: ${cachedPrice}`);
        broadcastGoldPriceUpdate(cachedPrice, 'CFI:XAUUSD', 'alphavantage');
      }
    }, broadcastIntervalMs);
    
    // بدء التحديثات الدورية
    this.updateInterval = window.setInterval(() => {
      this.updateGoldPrice();
    }, intervalMs);
  }
  
  stop() {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('تم إيقاف تحديثات سعر الذهب');
    }
  }
  
  // تفعيل أو تعطيل استخدام Alpha Vantage
  setUseAlphaVantage(enabled: boolean) {
    this.useAlphaVantage = enabled;
    // حفظ الحالة في التخزين المحلي
    localStorage.setItem('alpha_vantage_enabled', enabled.toString());
    console.log(`تم ${enabled ? 'تفعيل' : 'تعطيل'} استخدام Alpha Vantage للحصول على سعر الذهب`);
  }
  
  // الحصول على حالة استخدام Alpha Vantage
  getUseAlphaVantage(): boolean {
    return this.useAlphaVantage;
  }
  
  async updateGoldPrice() {
    try {
      if (this.priceUpdater.isRateLimited()) {
        console.log('تم تجاوز حد معدل API، تجاوز تحديث سعر الذهب');
        return;
      }
      
      console.log('جاري تحديث سعر الذهب...');
      
      // استخدام Alpha Vantage فقط إذا كان مفعلاً
      let price = null;
      
      if (this.useAlphaVantage) {
        price = await fetchGoldPrice();
      }
      
      if (price !== null) {
        // تحديث السعر المخزن مؤقتًا
        this.priceUpdater.setCachedGoldPrice(price);
        
        console.log(`تم تحديث سعر الذهب من Alpha Vantage: ${price}`);
        
        // بث تحديث السعر إلى جميع المستمعين
        broadcastGoldPriceUpdate(price, 'CFI:XAUUSD', 'alphavantage');
      } else {
        console.log('فشل في الحصول على سعر الذهب من API');
        
        // محاولة استخدام السعر الحالي المستخرج إذا كان متاحًا
        const extractedPriceElement = document.querySelector('.chart-price-display');
        const currentPrice = extractedPriceElement?.textContent;
        
        if (currentPrice && !isNaN(parseFloat(currentPrice.toString()))) {
          const extractedPrice = parseFloat(currentPrice.toString());
          console.log(`استخدام السعر المستخرج البديل: ${extractedPrice}`);
          this.priceUpdater.setCachedGoldPrice(extractedPrice);
          broadcastGoldPriceUpdate(extractedPrice, 'CFI:XAUUSD', 'extracted');
        }
      }
    } catch (error) {
      console.error('خطأ في تحديث سعر الذهب:', error);
      
      if (error instanceof Error && error.message.includes('rate limit')) {
        console.log('تم الوصول إلى حد معدل API');
      }
    }
  }
}
