
// خدمة استخراج السعر من صورة الشاشة
import { toast } from "sonner";

// واجهة لتحديثات السعر
export interface PriceUpdate {
  price: number;
  symbol: string;
  timestamp: number;
}

// فئة لإدارة قراءة السعر من الشاشة
export class ScreenPriceReader {
  private static instance: ScreenPriceReader;
  private intervalId: number | null = null;
  private price: number | null = null;
  private lastUpdateTime: number = 0;
  private isCapturing: boolean = false;
  private isMarketOpen: boolean = true; // تم تعديله للافتراض أن السوق مفتوح دائمًا للتطوير
  private lastMarketStatusCheck: number = 0;
  private readonly targetCoordinates = { x: 340, y: 240, width: 120, height: 30 }; // إحداثيات منطقة السعر - ستحتاج للتعديل

  // نمط المفرد للحصول على نسخة واحدة من القارئ
  public static getInstance(): ScreenPriceReader {
    if (!ScreenPriceReader.instance) {
      ScreenPriceReader.instance = new ScreenPriceReader();
    }
    return ScreenPriceReader.instance;
  }

  constructor() {
    // تعيين سعر افتراضي
    this.price = 2900.00;
    // التحقق من حالة السوق عند التهيئة
    this.checkMarketStatus();
  }

  // التحقق من حالة السوق
  private async checkMarketStatus(): Promise<void> {
    try {
      const now = Date.now();
      
      // التحقق من حالة السوق مرة كل 5 دقائق فقط
      if (now - this.lastMarketStatusCheck < 5 * 60 * 1000) {
        return;
      }
      
      this.lastMarketStatusCheck = now;
      
      // في بيئة التطوير، نفترض أن السوق مفتوح دائمًا
      this.isMarketOpen = true;
      
      console.log('حالة السوق:', this.isMarketOpen ? 'مفتوح' : 'مغلق');
    } catch (error) {
      console.error('خطأ في التحقق من حالة السوق:', error);
      // نضع حالة السوق كمفتوح في بيئة التطوير
      this.isMarketOpen = true;
    }
  }

  // بدء عملية القراءة بمعدل محدد
  public start(interval: number = 1000): void {
    if (this.intervalId !== null) {
      this.stop();
    }

    this.isCapturing = true;
    console.log("📸 بدء التقاط السعر من الشاشة كل", interval, "مللي ثانية");

    // التحقق من حالة السوق قبل البدء
    this.checkMarketStatus();
    
    // إذا لم يكن هناك سعر، نضع سعر افتراضي
    if (this.price === null) {
      this.price = 2900.00;
    }
    
    this.capturePrice();
    this.intervalId = window.setInterval(() => {
      // نتحقق من حالة السوق بانتظام
      this.checkMarketStatus();
      this.capturePrice();
    }, interval);
    
    // نشر السعر الحالي فورًا
    this.publishPriceUpdate(this.price || 2900.00);
  }

  // إيقاف عملية القراءة
  public stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      this.isCapturing = false;
      console.log("⏹️ تم إيقاف التقاط السعر من الشاشة");
    }
  }

  // الحصول على آخر سعر مقروء
  public getCurrentPrice(): number | null {
    return this.price;
  }

  // الحصول على حالة السوق
  public isMarketOpenNow(): boolean {
    return this.isMarketOpen;
  }

  // التقاط صورة لمنطقة السعر وقراءتها
  private async capturePrice(): Promise<void> {
    try {
      // رسالة تشخيصية
      console.log("محاولة التقاط سعر XAUUSD...");

      // إذا كان السوق مغلقًا، لا نقوم بتحديث السعر
      if (!this.isMarketOpen) {
        console.log("السوق مغلق حالياً، لن يتم تحديث السعر");
        return;
      }

      // محاكاة استخراج السعر من الصورة
      const extractedPrice = this.mockPriceExtraction();
      
      if (extractedPrice !== null) {
        this.price = extractedPrice;
        this.lastUpdateTime = Date.now();
        
        // نشر حدث بالسعر الجديد
        this.publishPriceUpdate(extractedPrice);
        
        console.log("✅ تم استخراج السعر بنجاح:", extractedPrice);
      } else {
        console.warn("⚠️ فشل في قراءة السعر من الصورة، استخدام القيمة الافتراضية");
        // استخدام السعر السابق أو القيمة الافتراضية
        if (this.price === null) {
          this.price = 2900.00;
          // نشر السعر الافتراضي
          this.publishPriceUpdate(this.price);
        }
      }
    } catch (error) {
      console.error("❌ خطأ أثناء التقاط السعر:", error);
      // استخدام السعر السابق أو القيمة الافتراضية
      if (this.price === null) {
        this.price = 2900.00;
        // نشر السعر الافتراضي
        this.publishPriceUpdate(this.price);
      }
    }
  }

  // محاكاة استخراج السعر (في التطبيق الحقيقي سيتم استبداله بقراءة OCR حقيقية)
  private mockPriceExtraction(): number | null {
    // في الإنتاج، سيتم استبدال هذا بقراءة OCR حقيقية
    
    // في بيئة التطوير، نستخدم سعرًا افتراضيًا مع تذبذب
    if (this.isMarketOpen) {
      // إذا كان لدينا سعر حالي، نولد تذبذبًا حوله
      if (this.price !== null) {
        const fluctuation = (Math.random() - 0.5) * 2; // تذبذب بين -1 و +1
        return parseFloat((this.price + fluctuation).toFixed(2));
      } 
      
      // إذا لم يكن لدينا سعر حالي، نستخدم قيمة افتراضية
      return 2900.00;
    } else {
      // إذا كان السوق مغلقًا، نعيد السعر الحالي بدون تغيير أو قيمة افتراضية
      return this.price || 2900.00;
    }
  }
  
  // نشر حدث بالسعر الجديد
  private publishPriceUpdate(price: number): void {
    const priceUpdate: PriceUpdate = {
      price: price,
      symbol: 'XAUUSD',
      timestamp: Date.now()
    };
    
    // نشر حدث تحديث السعر عبر TradingView
    window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
      detail: { 
        price: price, 
        symbol: 'XAUUSD',
        isMarketOpen: this.isMarketOpen
      }
    }));
    
    // نشر حدث الاستجابة للسعر الحالي
    window.dispatchEvent(new CustomEvent('current-price-response', {
      detail: { 
        price: price,
        symbol: 'XAUUSD',
        isMarketOpen: this.isMarketOpen,
        dayLow: price - 3,
        dayHigh: price + 3,
        weekLow: price - 60,
        weekHigh: price + 25,
        change: 0.35,
        changePercent: 0.012,
        recommendation: "Strong buy"
      }
    }));
    
    console.log("🔄 تم نشر تحديث السعر:", price);
  }
}

// تصدير نسخة مفردة
export const screenPriceReader = ScreenPriceReader.getInstance();
