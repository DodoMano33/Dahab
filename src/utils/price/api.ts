
import { toast } from "sonner";
import { ALPHA_VANTAGE_API_KEY } from "./config";

// سعر الذهب الافتراضي للحالات التي يفشل فيها الحصول على السعر المباشر
const DEFAULT_GOLD_PRICE = 2147.50;

export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    console.log(`Fetching crypto price for ${symbol}...`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      console.error("Error fetching crypto price:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    // التحقق من رسالة تجاوز حد معدل API
    if (data.Note || data.Information) {
      const message = data.Note || data.Information || 'API rate limit reached';
      console.error("API rate limit reached:", message);
      toast.error("تم تجاوز حد معدل API");
      
      // إذا كانت هناك رسالة حد معدل API ولكن نحتاج سعرًا، نعيد السعر الافتراضي
      if (symbol.toLowerCase() === 'btc' || symbol.toLowerCase() === 'btcusdt') {
        return 65000; // سعر بيتكوين افتراضي
      }
      return null;
    }

    const rate = data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"];
    if (!rate) {
      console.error("No exchange rate found in response:", data);
      return null;
    }

    console.log(`Successfully fetched price for ${symbol}: ${rate}`);
    return parseFloat(rate);
  } catch (error) {
    console.error("Error in fetchCryptoPrice:", error);
    return null;
  }
};

export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  try {
    // Split the forex pair into base and quote currencies
    const from = symbol.substring(0, 3);
    const to = symbol.substring(3, 6);

    console.log(`Fetching forex price for ${from}/${to}...`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      console.error("Error fetching forex price:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    // التحقق من رسالة تجاوز حد معدل API
    if (data.Note || data.Information) {
      const message = data.Note || data.Information || 'API rate limit reached';
      console.error("API rate limit reached:", message);
      toast.error("تم تجاوز حد معدل API");
      
      // إذا كانت هناك رسالة حد معدل API ولكن نحتاج سعرًا للذهب، نعيد السعر الافتراضي
      if (symbol === 'XAUUSD') {
        console.log(`Using default gold price: ${DEFAULT_GOLD_PRICE}`);
        return DEFAULT_GOLD_PRICE;
      }
      return null;
    }

    const rate = data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"];
    if (!rate) {
      console.error("No exchange rate found in response:", data);
      
      // إذا لم يتم العثور على سعر الصرف للذهب، استخدم السعر الافتراضي
      if (symbol === 'XAUUSD') {
        console.log(`No rate found, using default gold price: ${DEFAULT_GOLD_PRICE}`);
        return DEFAULT_GOLD_PRICE;
      }
      return null;
    }

    console.log(`Successfully fetched price for ${symbol}: ${rate}`);
    return parseFloat(rate);
  } catch (error) {
    console.error("Error in fetchForexPrice:", error);
    
    // في حالة حدوث خطأ أثناء جلب سعر الذهب، استخدم السعر الافتراضي
    if (symbol === 'XAUUSD') {
      console.log(`Error occurred, using default gold price: ${DEFAULT_GOLD_PRICE}`);
      return DEFAULT_GOLD_PRICE;
    }
    return null;
  }
};

export const fetchGoldPrice = async (): Promise<number | null> => {
  try {
    console.log('Fetching gold price...');
    const price = await fetchForexPrice('XAUUSD');
    
    // إذا كان السعر null، استخدم السعر الافتراضي
    if (price === null) {
      console.log(`Failed to fetch gold price, using default: ${DEFAULT_GOLD_PRICE}`);
      return DEFAULT_GOLD_PRICE;
    }
    
    return price;
  } catch (error) {
    console.error("Error in fetchGoldPrice:", error);
    console.log(`Error in fetchGoldPrice, using default: ${DEFAULT_GOLD_PRICE}`);
    return DEFAULT_GOLD_PRICE; // استخدام السعر الافتراضي في حالة الخطأ
  }
};
