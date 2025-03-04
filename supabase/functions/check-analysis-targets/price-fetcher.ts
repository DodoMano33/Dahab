
// دالة للحصول على السعر الحالي لرمز معين
export async function getCurrentPrice(symbol: string): Promise<number | null> {
  try {
    console.log(`Getting current price for ${symbol}`);

    // تعديل الرمز لتناسب واجهة Alpha Vantage
    const apiSymbol = symbol.includes("USD") ? symbol.replace("USD", "") : symbol;
    
    // استخدام واجهة برمجة Alpha Vantage للحصول على السعر
    const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY") || "74DI7LHBTQPLCOGR";
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${apiSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
      const price = parseFloat(data["Global Quote"]["05. price"]);
      console.log(`Current price for ${symbol}: ${price}`);
      return price;
    }
    
    // في حالة الفشل، نحاول استخدام واجهة برمجة بديلة
    console.log(`Failed to get price for ${symbol} via Alpha Vantage, trying alternative API`);
    
    if (symbol === "XAUUSD" || symbol === "GOLD") {
      // استخدام API مخصص لأسعار الذهب
      const goldUrl = "https://api.metals.live/v1/spot/gold";
      const goldResponse = await fetch(goldUrl);
      const goldData = await goldResponse.json();
      
      if (goldData && goldData.length > 0 && goldData[0].price) {
        console.log(`Gold price from alternative API: ${goldData[0].price}`);
        return goldData[0].price;
      }

      // محاولة استخدام API أخرى للذهب
      try {
        const metalAltUrl = "https://www.goldapi.io/api/XAU/USD";
        const metalResponse = await fetch(metalAltUrl, {
          headers: {
            "x-access-token": "goldapi-f20pyjvlfs7d6-io",
            "Content-Type": "application/json"
          }
        });
        const metalData = await metalResponse.json();
        if (metalData && metalData.price) {
          console.log(`Gold price from GoldAPI: ${metalData.price}`);
          return metalData.price;
        }
      } catch (metalError) {
        console.error("Error fetching from GoldAPI:", metalError);
      }
    }
    
    // محاولة أخرى للأسهم
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${apiSymbol}`;
    const yahooResponse = await fetch(yahooUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const yahooData = await yahooResponse.json();
    
    if (yahooData && yahooData.quoteResponse && yahooData.quoteResponse.result && 
        yahooData.quoteResponse.result.length > 0 && yahooData.quoteResponse.result[0].regularMarketPrice) {
      const price = yahooData.quoteResponse.result[0].regularMarketPrice;
      console.log(`Price from Yahoo Finance: ${price}`);
      return price;
    }
    
    // استخدام سعر ثابت للاختبار في حالة فشل كل المحاولات
    if (symbol === "XAUUSD") {
      console.log("Using hardcoded test price for XAUUSD: 2915");
      return 2915; // سعر ثابت للاختبار
    }
    
    console.log(`Failed to get price for ${symbol} from all sources`);
    return null;
  } catch (error) {
    console.error(`Error getting price for ${symbol}:`, error);
    return null;
  }
}
