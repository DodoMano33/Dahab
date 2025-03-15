
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
  private isMarketOpen: boolean = false;
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
      
      const response = await fetch('/api/check-market-status');
      if (!response.ok) {
        throw new Error('فشل في التحقق من حالة السوق');
      }
      
      const data = await response.json();
      this.isMarketOpen = data.isOpen;
      
      console.log('حالة السوق:', this.isMarketOpen ? 'مفتوح' : 'مغلق');
      
      // إذا كان السوق مغلقًا، لا نعدل السعر
      if (!this.isMarketOpen && this.price !== null) {
        console.log('السوق مغلق، توقف عن تحديث السعر');
      }
    } catch (error) {
      console.error('خطأ في التحقق من حالة السوق:', error);
      // افتراضيًا، نفترض أن السوق مفتوح في حالة الخطأ للسماح بالتجربة
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
    
    this.capturePrice();
    this.intervalId = window.setInterval(() => {
      // نتحقق من حالة السوق بانتظام
      this.checkMarketStatus();
      this.capturePrice();
    }, interval);
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
        console.log("السوق مغلق حاليًا، لن يتم تحديث السعر");
        return;
      }

      // في بيئة الإنتاج، ستحتاج إلى تنفيذ البرمجة المشتركة لالتقاط الشاشة
      // هنا سنقوم بمحاكاة القراءة من الصورة

      // محاكاة استخراج السعر من الصورة
      // في التطبيق الحقيقي، ستستخدم مكتبة OCR مثل Tesseract.js
      const extractedPrice = this.mockPriceExtraction();
      
      if (extractedPrice !== null) {
        this.price = extractedPrice;
        this.lastUpdateTime = Date.now();
        
        // نشر حدث بالسعر الجديد
        this.publishPriceUpdate(extractedPrice);
        
        console.log("✅ تم استخراج السعر بنجاح:", extractedPrice);
      } else {
        console.warn("⚠️ فشل في قراءة السعر من الصورة");
      }
    } catch (error) {
      console.error("❌ خطأ أثناء التقاط السعر:", error);
    }
  }

  // محاكاة استخراج السعر (في التطبيق الحقيقي سيتم استبداله بقراءة OCR حقيقية)
  private mockPriceExtraction(): number | null {
    // في الإنتاج، سيتم استبدال هذا بقراءة OCR حقيقية
    // محاكاة قراءة الصورة المرفقة التي تظهر 2984.91
    
    // لا نضيف تذبذب للسعر إذا كان السوق مغلقًا
    const basePrice = 2984.91;
    
    if (this.isMarketOpen) {
      // إضافة تذبذب صغير للسعر لمحاكاة تغيرات السوق في حالة السوق المفتوح
      const fluctuation = (Math.random() - 0.5) * 2; // تذبذب بين -1 و +1
      const price = parseFloat((basePrice + fluctuation).toFixed(2));
      return price;
    } else {
      // إرجاع السعر الثابت بدون تذبذب في حالة السوق المغلق
      return basePrice;
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
