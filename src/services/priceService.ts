
import { toast } from "sonner";

interface TradingViewPriceCache {
  [symbol: string]: {
    price: number;
    timestamp: number;
  };
}

// Cache to store prices obtained from TradingView
const tradingViewPriceCache: TradingViewPriceCache = {};

// Method to update the TradingView price cache
export const updateTradingViewPriceCache = (symbol: string, price: number) => {
  if (!symbol || !price) return;
  
  const normalizedSymbol = normalizeSymbol(symbol);
  tradingViewPriceCache[normalizedSymbol] = {
    price,
    timestamp: Date.now()
  };
  
  console.log(`Updated TradingView price cache for ${normalizedSymbol}: ${price}`);
};

// Helper to normalize symbols between formats
const normalizeSymbol = (symbol: string): string => {
  // Remove any exchange prefix
  const normalizedSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;
  return normalizedSymbol.toUpperCase();
};

/**
 * الحصول على السعر الحالي لرمز عملة
 */
export const fetchCurrentPrice = async (symbol: string): Promise<number | null> => {
  if (!symbol) return null;
  
  const normalizedSymbol = normalizeSymbol(symbol);
  
  try {
    console.log(`Fetching price for symbol: ${normalizedSymbol}`);
    
    // First check if we have a recent price in the TradingView cache
    const cachedData = tradingViewPriceCache[normalizedSymbol];
    const isCacheValid = cachedData && (Date.now() - cachedData.timestamp < 60000); // 1 minute cache
    
    if (isCacheValid) {
      console.log(`Using cached TradingView price for ${normalizedSymbol}: ${cachedData.price}`);
      return cachedData.price;
    }
    
    // Try to get price from Supabase function
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-current-price?symbol=${encodeURIComponent(normalizedSymbol)}`;
    
    console.log(`Making API request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    // تسجيل تفاصيل الاستجابة للتصحيح
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`فشل في الحصول على السعر: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`API response data:`, data);
    
    if (data && data.price !== undefined && data.price !== null) {
      console.log(`Successfully got price for ${normalizedSymbol}: ${data.price}`);
      return data.price;
    } else if (data && data.error) {
      throw new Error(`خطأ من API: ${data.error}`);
    }
    
    console.error("No price found in response", data);
    throw new Error("لم يتم العثور على السعر في الاستجابة");
  } catch (error) {
    console.error("خطأ في الحصول على السعر:", error);
    
    // Check if we have any TradingView cached price, even if not fresh
    const cachedData = tradingViewPriceCache[normalizedSymbol];
    if (cachedData) {
      console.log(`Using older cached TradingView price for ${normalizedSymbol}: ${cachedData.price}`);
      toast.info(`تم استخدام آخر سعر معروف لـ ${normalizedSymbol}`);
      return cachedData.price;
    }
    
    // محاولة بالطريقة البديلة للبيانات المعروفة
    if (normalizedSymbol === "XAUUSD" || normalizedSymbol === "GOLD") {
      try {
        console.log("Attempting fallback for gold price");
        const fallbackResponse = await fetch("https://api.metals.live/v1/spot/gold");
        const goldData = await fallbackResponse.json();
        if (goldData && goldData.length > 0 && goldData[0].price) {
          console.log(`Got fallback gold price: ${goldData[0].price}`);
          return goldData[0].price;
        }
      } catch (fallbackError) {
        console.error("Fallback gold price fetch failed:", fallbackError);
      }
    }
    
    // أسعار ثابتة للاختبار لبعض الرموز الشائعة
    const testPrices: Record<string, number> = {
      "XAUUSD": 2915,
      "GOLD": 2915,
      "EURUSD": 1.0723,
      "GBPUSD": 1.2685,
      "USDJPY": 151.43,
      "BTCUSD": 65800,
      "BTCUSDT": 65800,
      "ETHUSDT": 3050,
      "ETHUSD": 3050
    };
    
    if (testPrices[normalizedSymbol]) {
      console.log(`Using test price for ${normalizedSymbol}: ${testPrices[normalizedSymbol]}`);
      toast.info("تم استخدام سعر تقديري للاختبار");
      return testPrices[normalizedSymbol];
    }
    
    return null;
  }
};
