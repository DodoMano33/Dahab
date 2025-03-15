
// خدمة استخراج السعر من الصورة

import { toast } from "sonner";

/**
 * فئة لاستخراج السعر من الصورة
 */
export class PriceExtractor {
  private lastExtractedPrice: number | null = null;
  
  constructor(private defaultPrice: number = 2900.00) {
    this.lastExtractedPrice = defaultPrice;
  }
  
  /**
   * محاكاة استخراج السعر (في التطبيق الحقيقي سيتم استبداله بقراءة OCR حقيقية)
   */
  public mockPriceExtraction(isMarketOpen: boolean): number | null {
    // في الإنتاج، سيتم استبدال هذا بقراءة OCR حقيقية
    
    // في بيئة التطوير، نستخدم سعرًا افتراضيًا مع تذبذب
    if (isMarketOpen) {
      // إذا كان لدينا سعر حالي، نولد تذبذبًا حوله
      if (this.lastExtractedPrice !== null) {
        const fluctuation = (Math.random() - 0.5) * 2; // تذبذب بين -1 و +1
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
   * استخراج السعر من الصورة (واجهة للاستخدام الخارجي)
   */
  public extractPrice(isMarketOpen: boolean): number | null {
    try {
      console.log("محاولة التقاط سعر XAUUSD...");
      
      // محاكاة استخراج السعر من الصورة
      const extractedPrice = this.mockPriceExtraction(isMarketOpen);
      
      if (extractedPrice !== null) {
        console.log("✅ تم استخراج السعر بنجاح:", extractedPrice);
      } else {
        console.warn("⚠️ فشل في قراءة السعر من الصورة، استخدام القيمة الافتراضية");
      }
      
      return extractedPrice;
    } catch (error) {
      console.error("❌ خطأ أثناء التقاط السعر:", error);
      return this.lastExtractedPrice || this.defaultPrice;
    }
  }
}
