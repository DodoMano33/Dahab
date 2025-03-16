
import { PriceUpdater } from '../core/PriceUpdater';
import { fetchGoldPrice } from '../api';
import { broadcastGoldPriceUpdate } from '../events/priceEventBroadcaster';

/**
 * مكون متخصص لتحديث سعر الذهب بشكل دوري
 */
export class GoldPriceUpdater {
  private updateInterval: number | null = null;
  private readonly priceUpdater: PriceUpdater;
  
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
  
  async updateGoldPrice() {
    try {
      if (this.priceUpdater.isRateLimited()) {
        console.log('تم تجاوز حد معدل API، تجاوز تحديث سعر الذهب');
        return;
      }
      
      console.log('جاري تحديث سعر الذهب...');
      const price = await fetchGoldPrice();
      
      if (price !== null) {
        // تحديث السعر المخزن مؤقتًا
        this.priceUpdater.setCachedGoldPrice(price);
        
        console.log(`تم تحديث سعر الذهب من Alpha Vantage: ${price}`);
        
        // بث تحديث السعر إلى جميع المستمعين
        broadcastGoldPriceUpdate(price, 'CFI:XAUUSD', 'alphavantage');
      } else {
        console.log('فشل في الحصول على سعر الذهب من API');
        
        // محاولة استخدام السعر الحالي المستخرج إذا كان متاحًا
        const currentPrice = window.currentExtractedPrice || document.querySelector('.chart-price-display')?.textContent;
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
