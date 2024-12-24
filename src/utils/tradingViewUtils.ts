const PLACEHOLDER_CHART = "/placeholder.svg";

export const getTradingViewChartImage = async (symbol: string, timeframe: string): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    if (!symbol || !timeframe) {
      throw new Error("يجب تحديد الرمز والإطار الزمني");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, return placeholder chart
    console.log("تم جلب صورة الشارت بنجاح:", PLACEHOLDER_CHART);
    return PLACEHOLDER_CHART;
    
  } catch (error) {
    console.error("خطأ في جلب صورة الشارت:", error);
    throw new Error("حدث خطأ أثناء جلب الرسم البياني");
  }
};

export const getCurrentPriceFromTradingView = async (symbol: string): Promise<number> => {
  console.log("محاولة جلب السعر الحالي من TradingView:", symbol);
  
  try {
    // Updated mock prices to match current market prices
    const mockPrices: { [key: string]: number } = {
      'XAUUSD': 2615.43,
      'BTCUSD': 42150.75,
      'ETHUSD': 2245.30,
      'EURUSD': 1.0925,
      'GBPUSD': 1.2715,
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const basePrice = mockPrices[symbol.toUpperCase()];
    if (!basePrice) {
      throw new Error(`لا يتوفر سعر للعملة ${symbol}`);
    }
    
    const randomVariation = (Math.random() - 0.5) * 0.001 * basePrice;
    const price = Number((basePrice + randomVariation).toFixed(2));
    
    console.log("تم جلب السعر الحالي بنجاح:", price);
    return price;
    
  } catch (error) {
    console.error("خطأ في جلب السعر الحالي:", error);
    throw error;
  }
};