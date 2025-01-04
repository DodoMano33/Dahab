import { priceUpdater } from "./priceUpdater";

// صورة افتراضية للتطوير والعرض التجريبي
const PLACEHOLDER_CHART = "/placeholder.svg";

export const getTradingViewChartImage = async (symbol: string, timeframe: string): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    if (!symbol || !timeframe) {
      throw new Error("يجب تحديد الرمز والإطار الزمني");
    }

    // محاولة جلب السعر الحالي للتأكد من صحة الرمز
    await priceUpdater.fetchPrice(symbol);
    
    // استخدام الصورة الافتراضية للتطوير
    console.log("تم جلب صورة الشارت بنجاح:", PLACEHOLDER_CHART);
    return PLACEHOLDER_CHART;
    
  } catch (error) {
    console.error("خطأ في جلب صورة الشارت:", error);
    throw new Error("فشل في جلب صورة الشارت. الرجاء التحقق من صحة الرمز والمحاولة مرة أخرى.");
  }
};

export const getCurrentPriceFromTradingView = async (symbol: string): Promise<number> => {
  console.log("محاولة جلب السعر الحالي من TradingView:", symbol);
  
  try {
    const price = await priceUpdater.fetchPrice(symbol);
    console.log("تم جلب السعر الحالي بنجاح:", price);
    return price;
    
  } catch (error) {
    console.error("خطأ في جلب السعر الحالي:", error);
    throw new Error("فشل في جلب السعر الحالي. الرجاء التحقق من صحة الرمز والمحاولة مرة أخرى.");
  }
};