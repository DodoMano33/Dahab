
import { AnalysisData } from "@/types/analysis";

interface EntryPointResult {
  price: number | undefined;
  reason: string | undefined;
}

export const useBestEntryPoint = (analysis: AnalysisData, id: string): EntryPointResult => {
  // طباعة تشخيصية للمعلومات الكاملة
  console.log(`Full analysis data for ${id}:`, analysis);
  console.log(`Best entry point data for ${id}:`, analysis.bestEntryPoint);
  
  // التحقق من وجود كائن أفضل نقطة دخول
  if (!analysis.bestEntryPoint) {
    console.log(`No bestEntryPoint object for analysis ${id}`);
    
    // التحقق من وجود الحقل القديم entryPoint (للتوافق مع البيانات القديمة)
    if ('entryPoint' in analysis && analysis.entryPoint !== undefined) {
      // استخدام type assertion لتحويل النوع إلى number أو string
      const entryPointValue = analysis.entryPoint as (number | string);
      const price = typeof entryPointValue === 'string' 
        ? parseFloat(entryPointValue) 
        : entryPointValue;
        
      console.log(`Using legacy entryPoint value for ${id}:`, price);
      
      return {
        price,
        reason: "نقطة دخول من التحليل"
      };
    }
    
    // إذا لم نجد أي من الحقلين، نعيد قيمًا فارغة
    return { price: undefined, reason: undefined };
  }
  
  // التحقق من وجود السعر والسبب
  let price = undefined;
  let reason = undefined;
  
  // إذا كان الكائن موجود، افحص إذا كان السعر والسبب موجودين
  if (typeof analysis.bestEntryPoint === 'object') {
    // التحقق من السعر وتحويله إلى رقم إذا كان موجود
    if ('price' in analysis.bestEntryPoint && analysis.bestEntryPoint.price !== undefined) {
      const priceValue = analysis.bestEntryPoint.price;
      price = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
      
      // التحقق من صحة الرقم
      if (isNaN(Number(price))) {
        console.log(`Invalid price value for ${id}:`, price);
        price = undefined;
      } else {
        console.log(`Valid price found for ${id}:`, price);
      }
    }
    
    // التحقق من وجود السبب
    if ('reason' in analysis.bestEntryPoint) {
      reason = analysis.bestEntryPoint.reason;
      console.log(`Reason for best entry point ${id}:`, reason);
    }
  } else if (typeof analysis.bestEntryPoint === 'number') {
    // إذا كان السعر رقم مباشر
    price = analysis.bestEntryPoint;
    reason = "نقطة دخول محسوبة من التحليل";
    console.log(`Direct numeric price for ${id}:`, price);
  }
  
  // إذا كان السعر غير محدد ولكن تم تحديد الاتجاه والسعر الحالي، نقوم بإنشاء سعر
  if ((price === undefined || isNaN(Number(price))) && analysis.direction && analysis.currentPrice) {
    console.log(`Creating price based on direction and current price`);
    
    if (analysis.direction === "صاعد") {
      price = Number((analysis.currentPrice * 0.995).toFixed(4));
    } else {
      price = Number((analysis.currentPrice * 1.005).toFixed(4));
    }
    
    if (!reason) {
      reason = "نقطة دخول تلقائية بناء على الاتجاه";
    }
  }
  
  console.log(`Final best entry point for analysis ${id}:`, { price, reason });
  
  return { price, reason };
};
