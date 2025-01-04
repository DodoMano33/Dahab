import { priceUpdater } from "./priceUpdater";

// صورة افتراضية للتطوير والعرض التجريبي
const PLACEHOLDER_CHART = "/placeholder.svg";

export const getTradingViewChartImage = async (symbol: string, timeframe: string): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    if (!symbol || !timeframe) {
      console.error("بيانات غير صالحة:", { symbol, timeframe });
      throw new Error("يجب تحديد الرمز والإطار الزمني");
    }

    // تنظيف وتنسيق الرمز
    const formattedSymbol = symbol.trim().toUpperCase();
    console.log("الرمز المنسق:", formattedSymbol);

    try {
      // محاولة جلب السعر الحالي للتأكد من صحة الرمز
      await priceUpdater.fetchPrice(formattedSymbol);
      console.log("تم التحقق من صحة الرمز:", formattedSymbol);
    } catch (priceError) {
      console.error("خطأ في جلب السعر:", priceError);
      throw new Error("الرمز غير صالح أو غير متوفر. الرجاء التحقق من صحة الرمز.");
    }
    
    // استخدام الصورة الافتراضية للتطوير
    console.log("تم جلب صورة الشارت بنجاح:", PLACEHOLDER_CHART);
    return PLACEHOLDER_CHART;
    
  } catch (error) {
    console.error("خطأ في جلب صورة الشارت:", error);
    throw new Error(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
  }
};

export const getCurrentPriceFromTradingView = async (symbol: string): Promise<number> => {
  console.log("محاولة جلب السعر الحالي من TradingView:", symbol);
  
  try {
    if (!symbol) {
      throw new Error("الرجاء إدخال رمز صالح");
    }

    const formattedSymbol = symbol.trim().toUpperCase();
    const price = await priceUpdater.fetchPrice(formattedSymbol);
    console.log("تم جلب السعر الحالي بنجاح:", price);
    return price;
    
  } catch (error) {
    console.error("خطأ في جلب السعر الحالي:", error);
    throw new Error("فشل في جلب السعر الحالي. الرجاء التحقق من صحة الرمز والمحاولة مرة أخرى.");
  }
};