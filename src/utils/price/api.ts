import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const getAlphaVantageKey = async (): Promise<string> => {
  console.log("Fetching Alpha Vantage API key from Supabase...");
  
  try {
    const { data, error } = await supabase
      .functions.invoke('get-secret', {
        body: { secretName: 'ALPHA_VANTAGE_API_KEY' }
      });

    if (error) {
      console.error("Error fetching Alpha Vantage API key:", error);
      toast.error("حدث خطأ أثناء جلب مفتاح API");
      return '';
    }
    
    if (!data?.secret) {
      console.error("No API key found in response:", data);
      toast.error("لم نتمكن من الوصول إلى مفتاح API");
      return '';
    }
    
    console.log("Successfully retrieved Alpha Vantage API key");
    return data.secret;
  } catch (error) {
    console.error("Error in getAlphaVantageKey:", error);
    toast.error("حدث خطأ في الوصول إلى مفتاح API");
    return '';
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