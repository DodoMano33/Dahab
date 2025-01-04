import { priceUpdater } from "./price/priceUpdater";

const PLACEHOLDER_CHART = "/placeholder.svg";

export const getTradingViewChartImage = async (symbol: string, timeframe: string): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    if (!symbol || !timeframe) {
      throw new Error("يجب تحديد الرمز والإطار الزمني");
    }

    const formattedSymbol = symbol.trim().toUpperCase();
    console.log("الرمز المنسق:", formattedSymbol);

    try {
      await priceUpdater.fetchPrice(formattedSymbol);
      console.log("تم التحقق من صحة الرمز:", formattedSymbol);
    } catch (error) {
      console.error("خطأ في جلب السعر:", error);
      throw error;
    }
    
    return PLACEHOLDER_CHART;
    
  } catch (error) {
    console.error("خطأ في جلب صورة الشارت:", error);
    throw error;
  }
};

export const getCurrentPriceFromTradingView = async (symbol: string): Promise<number> => {
  console.log("محاولة جلب السعر الحالي من TradingView:", symbol);
  
  try {
    if (!symbol) {
      throw new Error("الرجاء إدخال رمز صالح");
    }

    const formattedSymbol = symbol.trim().toUpperCase();
    return await priceUpdater.fetchPrice(formattedSymbol);
    
  } catch (error) {
    console.error("خطأ في جلب السعر الحالي:", error);
    throw error;
  }
};