import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// استخدام مفتاح API للتطبيق
const DEFAULT_API_KEY = 'RTZ3G9HKJZ0VHIQ';

export const getAlphaVantageKey = async (): Promise<string> => {
  console.log("جاري جلب مفتاح Alpha Vantage API...");
  
  try {
    // محاولة الحصول على المفتاح من Supabase (إذا كان متاحًا)
    const { data, error } = await supabase
      .functions.invoke('get-secret', {
        body: { secretName: 'ALPHA_VANTAGE_API_KEY' }
      });

    if (error) {
      console.error("خطأ في جلب مفتاح Alpha Vantage API:", error);
      // استخدام المفتاح الافتراضي
      console.log("استخدام مفتاح API الافتراضي");
      return DEFAULT_API_KEY;
    }
    
    if (!data?.secret) {
      console.log("لم يتم العثور على مفتاح في Supabase، استخدام المفتاح الافتراضي");
      return DEFAULT_API_KEY;
    }
    
    console.log("تم جلب مفتاح Alpha Vantage API بنجاح");
    return data.secret;
  } catch (error) {
    console.error("خطأ في getAlphaVantageKey:", error);
    console.log("استخدام مفتاح API الافتراضي");
    return DEFAULT_API_KEY;
  }
};

export const fetchGoldPrice = async (): Promise<number | null> => {
  try {
    const apiKey = await getAlphaVantageKey();
    
    console.log("جاري جلب سعر الذهب من Alpha Vantage...");
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      console.error("خطأ في جلب سعر الذهب:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.Note) {
      console.error("تم تجاوز حد معدل API:", data.Note);
      toast.error("تم تجاوز حد معدل API لـ Alpha Vantage");
      return null;
    }

    const exchangeRate = data["Realtime Currency Exchange Rate"];
    if (!exchangeRate) {
      console.error("لم يتم العثور على بيانات سعر الصرف في الاستجابة:", data);
      return null;
    }

    const price = exchangeRate["5. Exchange Rate"];
    if (!price) {
      console.error("لم يتم العثور على سعر الصرف في الاستجابة:", exchangeRate);
      return null;
    }

    console.log(`تم جلب سعر الذهب الحالي: ${price}`);
    return parseFloat(price);
  } catch (error) {
    console.error("خطأ في fetchGoldPrice:", error);
    return null;
  }
};

export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    const apiKey = await getAlphaVantageKey();
    if (!apiKey) {
      console.error("No API key available");
      return null;
    }

    console.log(`Fetching crypto price for ${symbol}...`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${apiKey}`,
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
    
    if (data.Note) {
      console.error("API rate limit reached:", data.Note);
      toast.error("تم تجاوز حد معدل API");
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
    const apiKey = await getAlphaVantageKey();
    if (!apiKey) {
      console.error("No API key available");
      return null;
    }

    // Split the forex pair into base and quote currencies
    const from = symbol.substring(0, 3);
    const to = symbol.substring(3, 6);

    console.log(`Fetching forex price for ${from}/${to}...`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${apiKey}`,
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
    
    if (data.Note) {
      console.error("API rate limit reached:", data.Note);
      toast.error("تم تجاوز حد معدل API");
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
    console.error("Error in fetchForexPrice:", error);
    return null;
  }
};
