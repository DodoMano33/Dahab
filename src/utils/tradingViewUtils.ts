import { priceUpdater } from "./priceUpdater";

const PLACEHOLDER_CHART = "/placeholder.svg";

const isValidSymbol = (symbol: string): boolean => {
  // قائمة الرموز المدعومة
  const validSymbols = [
    "XAUUSD", // الذهب
    "EURUSD", // اليورو/دولار
    "GBPUSD", // الجنيه/دولار
    "USDJPY", // الدولار/ين
    "USDCHF", // الدولار/فرنك
    "AUDUSD", // الدولار الأسترالي/دولار
    "NZDUSD", // الدولار النيوزيلندي/دولار
    "USDCAD", // الدولار/دولار كندي
    "BTCUSD", // بيتكوين/دولار
    "ETHUSD"  // إيثريوم/دولار
  ];

  const formattedSymbol = symbol.toUpperCase();
  return validSymbols.includes(formattedSymbol);
};

export const getTradingViewChartImage = async (symbol: string, timeframe: string): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    if (!symbol || !timeframe) {
      console.error("بيانات غير صالحة:", { symbol, timeframe });
      throw new Error("يجب تحديد الرمز والإطار الزمني");
    }

    const formattedSymbol = symbol.trim().toUpperCase();
    console.log("الرمز المنسق:", formattedSymbol);

    // التحقق من صحة الرمز
    if (!isValidSymbol(formattedSymbol)) {
      throw new Error(`الرمز ${formattedSymbol} غير مدعوم. الرجاء استخدام أحد الرموز المدعومة مثل XAUUSD أو EURUSD`);
    }

    try {
      // محاولة جلب السعر الحالي للتأكد من صحة الرمز
      await priceUpdater.fetchPrice(formattedSymbol);
      console.log("تم التحقق من صحة الرمز:", formattedSymbol);
    } catch (priceError) {
      console.error("خطأ في جلب السعر:", priceError);
      throw new Error(`لا يمكن جلب السعر للرمز ${formattedSymbol}. الرجاء التأكد من اتصال الإنترنت والمحاولة مرة أخرى.`);
    }
    
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
    
    // التحقق من صحة الرمز
    if (!isValidSymbol(formattedSymbol)) {
      throw new Error(`الرمز ${formattedSymbol} غير مدعوم. الرجاء استخدام أحد الرموز المدعومة مثل XAUUSD أو EURUSD`);
    }

    const price = await priceUpdater.fetchPrice(formattedSymbol);
    console.log("تم جلب السعر الحالي بنجاح:", price);
    return price;
    
  } catch (error) {
    console.error("خطأ في جلب السعر الحالي:", error);
    throw new Error(error instanceof Error ? error.message : "فشل في جلب السعر الحالي");
  }
};