
import { toast } from "sonner";

/**
 * الحصول على السعر الحالي لرمز عملة
 */
export const fetchCurrentPrice = async (symbol: string): Promise<number | null> => {
  if (!symbol) return null;
  
  try {
    console.log(`Fetching price for symbol: ${symbol}`);
    
    // يستخدم نفس الوظيفة الموجودة في Supabase Functions
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-current-price?symbol=${encodeURIComponent(symbol)}`;
    
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
      console.log(`Successfully got price for ${symbol}: ${data.price}`);
      return data.price;
    } else if (data && data.error) {
      throw new Error(`خطأ من API: ${data.error}`);
    }
    
    console.error("No price found in response", data);
    throw new Error("لم يتم العثور على السعر في الاستجابة");
  } catch (error) {
    console.error("خطأ في الحصول على السعر:", error);
    toast.error("تعذر الحصول على سعر العملة");
    
    // محاولة بالطريقة البديلة للبيانات المعروفة
    if (symbol === "XAUUSD" || symbol === "GOLD") {
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
      "EURUSD": 1.0723,
      "GBPUSD": 1.2685,
      "USDJPY": 151.43,
      "BTCUSD": 65800,
      "ETHUSD": 3050
    };
    
    if (testPrices[symbol]) {
      console.log(`Using test price for ${symbol}: ${testPrices[symbol]}`);
      toast.info("تم استخدام سعر تقديري للاختبار");
      return testPrices[symbol];
    }
    
    return null;
  }
};
