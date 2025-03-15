
// خدمة استخراج السعر من صورة الشاشة
import { toast } from "sonner";
import { PriceExtractor } from "./priceExtractor";
import { marketStatusService } from "./marketStatus";
import { publishPriceUpdate } from "./events";
import { ScreenReaderOptions, PriceUpdate } from "./types";

/**
 * فئة لإدارة قراءة السعر من الشاشة
 */
export class ScreenPriceReader {
  private static instance: ScreenPriceReader;
  private intervalId: number | null = null;
  private price: number | null = null;
  private lastUpdateTime: number = 0;
  private isCapturing: boolean = false;
  private priceExtractor: PriceExtractor;
  private readonly defaultOptions: ScreenReaderOptions = {
    interval: 1000,
    defaultPrice: 2900.00,
    targetCoordinates: { x: 340, y: 240, width: 120, height: 30 }
  };

  /**
   * نمط المفرد للحصول على نسخة واحدة من القارئ
   */
  public static getInstance(): ScreenPriceReader {
    if (!ScreenPriceReader.instance) {
      ScreenPriceReader.instance = new ScreenPriceReader();
    }
    return ScreenPriceReader.instance;
  }

  constructor(options?: ScreenReaderOptions) {
    const config = { ...this.defaultOptions, ...options };
    
    // تعيين سعر افتراضي
    this.price = config.defaultPrice || 2900.00;
    
    // إنشاء مستخرج السعر
    this.priceExtractor = new PriceExtractor(config.defaultPrice);
    
    // التحقق من حالة السوق عند التهيئة
    marketStatusService.checkMarketStatus();
  }

  /**
   * بدء عملية القراءة بمعدل محدد
   */
  public start(interval: number = 1000): void {
    if (this.intervalId !== null) {
      this.stop();
    }

    this.isCapturing = true;
    console.log("📸 بدء التقاط السعر من الشاشة كل", interval, "مللي ثانية");

    // التحقق من حالة السوق قبل البدء
    marketStatusService.checkMarketStatus();
    
    // إذا لم يكن هناك سعر، نضع سعر افتراضي
    if (this.price === null) {
      this.price = 2900.00;
    }
    
    this.capturePrice();
    this.intervalId = window.setInterval(() => {
      // نتحقق من حالة السوق بانتظام
      marketStatusService.checkMarketStatus();
      this.capturePrice();
    }, interval);
    
    // نشر السعر الحالي فورًا
    this.publishPriceUpdate(this.price || 2900.00);
  }

  /**
   * إيقاف عملية القراءة
   */
  public stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      this.isCapturing = false;
      console.log("⏹️ تم إيقاف التقاط السعر من الشاشة");
    }
  }

  /**
   * الحصول على آخر سعر مقروء
   */
  public getCurrentPrice(): number | null {
    return this.price;
  }

  /**
   * الحصول على حالة السوق
   */
  public isMarketOpenNow(): boolean {
    return marketStatusService.isMarketOpen();
  }

  /**
   * التقاط صورة لمنطقة السعر وقراءتها
   */
  private async capturePrice(): Promise<void> {
    try {
      // رسالة تشخيصية
      console.log("محاولة التقاط سعر XAUUSD...");

      // الحصول على حالة السوق الحالية
      const isMarketOpen = marketStatusService.isMarketOpen();
      
      // إذا كان السوق مغلقًا، لا نقوم بتحديث السعر
      if (!isMarketOpen) {
        console.log("السوق مغلق حالياً، لن يتم تحديث السعر");
        return;
      }

      // استخراج السعر من الصورة
      const extractedPrice = this.priceExtractor.extractPrice(isMarketOpen);
      
      if (extractedPrice !== null) {
        this.price = extractedPrice;
        this.lastUpdateTime = Date.now();
        
        // نشر حدث بالسعر الجديد
        this.publishPriceUpdate(extractedPrice);
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
  
  /**
   * نشر حدث بالسعر الجديد
   */
  private publishPriceUpdate(price: number): void {
    publishPriceUpdate(price, 'XAUUSD', marketStatusService.isMarketOpen());
  }
}

// تصدير نسخة مفردة
export const screenPriceReader = ScreenPriceReader.getInstance();
