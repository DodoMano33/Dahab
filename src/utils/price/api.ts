
import { toast } from "sonner";
import { ALPHA_VANTAGE_API_KEY } from "./config";

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

export const fetchGoldPrice = async (): Promise<number | null> => {
  try {
    console.log('Fetching gold price...');
    return await fetchForexPrice('XAUUSD');
  } catch (error) {
    console.error("Error in fetchGoldPrice:", error);
    return null;
  }
};
