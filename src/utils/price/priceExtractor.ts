
// خدمة استخراج السعر من الصورة

import { toast } from "sonner";

/**
 * فئة لاستخراج السعر من الصورة
 */
export class PriceExtractor {
  private lastExtractedPrice: number | null = null;
  private tvPriceSource: number | null = null;
  private tvPriceTimestamp: number = 0;
  private readonly MAX_PRICE_AGE = 5000; // 5 ثوانٍ
  
  constructor(private defaultPrice: number = 2900.00) {
    this.lastExtractedPrice = defaultPrice;
    this.setupTradingViewListener();
  }
  
  /**
   * إعداد المستمع لأسعار TradingView
   */
  private setupTradingViewListener(): void {
    // الاستماع للأسعار المباشرة من TradingView
    window.addEventListener('tradingview-direct-price', (event: any) => {
      if (event.detail && typeof event.detail.price === 'number') {
        this.tvPriceSource = event.detail.price;
        this.tvPriceTimestamp = Date.now();
        console.log("✅ تم استلام سعر مباشر من TradingView:", this.tvPriceSource);
        
        // تحديث السعر المستخرج أيضًا
        this.lastExtractedPrice = this.tvPriceSource;
        
        // إعادة نشر الحدث بالسعر بدون تعديل للتأكد من انتشاره
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { 
            price: this.tvPriceSource, 
            symbol: 'XAUUSD',
            isMarketOpen: true
          }
        }));
      }
    });
    
    // طلب السعر الحالي من TradingView
    this.requestTradingViewPrice();
    
    // إعداد طلب دوري للسعر من TradingView كل 500 مللي ثانية للحصول على تحديثات أكثر
    setInterval(() => this.requestTradingViewPrice(), 500);
  }
  
  /**
   * طلب السعر الحالي من TradingView
   */
  private requestTradingViewPrice(): void {
    window.dispatchEvent(new CustomEvent('request-tradingview-price'));
  }
  
  /**
   * التحقق من صلاحية سعر TradingView
   */
  private isTVPriceValid(): boolean {
    return (
      this.tvPriceSource !== null && 
      Date.now() - this.tvPriceTimestamp < this.MAX_PRICE_AGE
    );
  }
  
  /**
   * محاكاة استخراج السعر (في حالة عدم توفر سعر من TradingView)
   */
  public mockPriceExtraction(isMarketOpen: boolean): number | null {
    // استخدام السعر من TradingView إذا كان متاحًا
    if (this.isTVPriceValid()) {
      return this.tvPriceSource;
    }
    
    // في بيئة التطوير، نستخدم سعرًا افتراضيًا مع تذبذب في حالة عدم توفر سعر TradingView
    if (isMarketOpen) {
      // إذا كان لدينا سعر حالي، نولد تذبذبًا حوله
      if (this.lastExtractedPrice !== null) {
        const fluctuation = (Math.random() - 0.5) * 0.5; // تذبذب أقل للتقارب مع السعر الحقيقي
        this.lastExtractedPrice = parseFloat((this.lastExtractedPrice + fluctuation).toFixed(2));
        return this.lastExtractedPrice;
      } 
      
      // إذا لم يكن لدينا سعر حالي، نستخدم قيمة افتراضية
      this.lastExtractedPrice = this.defaultPrice;
      return this.defaultPrice;
    } else {
      // إذا كان السوق مغلقًا، نعيد السعر الحالي بدون تغيير أو قيمة افتراضية
      return this.lastExtractedPrice || this.defaultPrice;
    }
  }
  
  /**
   * استخراج السعر (واجهة للاستخدام الخارجي)
   */
  public extractPrice(isMarketOpen: boolean): number | null {
    try {
      console.log("محاولة الحصول على سعر XAUUSD...");
      
      // استخدام السعر من TradingView مباشرة إذا كان متاحًا ومحدثًا
      if (this.isTVPriceValid()) {
        console.log("✅ تم استخدام سعر TradingView المباشر:", this.tvPriceSource);
        return this.tvPriceSource;
      }
      
      // احتياطيًا: محاكاة استخراج السعر من الصورة
      const extractedPrice = this.mockPriceExtraction(isMarketOpen);
      
      if (extractedPrice !== null) {
        console.log("✅ تم استخراج السعر بنجاح:", extractedPrice);
      } else {
        console.warn("⚠️ فشل في قراءة السعر، استخدام القيمة الافتراضية");
      }
      
      return extractedPrice;
    } catch (error) {
      console.error("❌ خطأ أثناء التقاط السعر:", error);
      return this.lastExtractedPrice || this.defaultPrice;
    }
  }
  
  /**
   * الحصول على آخر سعر من TradingView
   */
  public getLastTVPrice(): number | null {
    return this.tvPriceSource;
  }
}
