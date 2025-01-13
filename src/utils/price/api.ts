import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { PriceResponse } from './types';
import { toast } from 'sonner';

const getAlphaVantageKey = async () => {
  try {
    console.log('Fetching Alpha Vantage API key from Supabase...');
    
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { name: 'ALPHA_VANTAGE_API_KEY' }
    });
    
    if (error) {
      console.error("Error fetching Alpha Vantage API key:", error);
      throw new Error("لم نتمكن من الوصول إلى مفتاح API");
    }
    
    if (!data?.secret) {
      console.error("No API key found in response:", data);
      throw new Error("لم نتمكن من الوصول إلى مفتاح API");
    }
    
    return data.secret;
  } catch (error) {
    console.error("Error in getAlphaVantageKey:", error);
    throw error;
  }
};

export const fetchCryptoPrice = async (symbol: string): Promise<number> => {
  try {
    console.log("محاولة جلب سعر العملة المشفرة:", symbol);
    
    const apiKey = await getAlphaVantageKey();
    const cleanSymbol = symbol.replace('USDT', '').replace('USD', '');
    
    const response = await axios.get<PriceResponse>(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${cleanSymbol}&to_currency=USD&apikey=${apiKey}`
    );

    console.log("استجابة ناجحة:", {
      url: response.config.url,
      status: response.status
    });

    const exchangeRate = response.data["Realtime Currency Exchange Rate"];
    if (!exchangeRate || !exchangeRate["5. Exchange Rate"]) {
      console.error("No exchange rate found in response:", response.data);
      return 0;
    }

    const price = parseFloat(exchangeRate["5. Exchange Rate"]);
    if (isNaN(price) || price <= 0) {
      console.error("Invalid price value:", price);
      return 0;
    }

    return price;
  } catch (error) {
    console.error("خطأ في جلب سعر العملة المشفرة:", error);
    return 0;
  }
};

export const fetchForexPrice = async (symbol: string): Promise<number> => {
  try {
    console.log("محاولة جلب سعر الفوركس:", symbol);
    
    const apiKey = await getAlphaVantageKey();
    const baseCurrency = symbol.slice(0, 3);
    const quoteCurrency = symbol.slice(3, 6);
    
    if (!baseCurrency || !quoteCurrency) {
      console.error("Invalid forex symbol format:", symbol);
      return 0;
    }

    const response = await axios.get<PriceResponse>(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${quoteCurrency}&apikey=${apiKey}`
    );

    console.log("استجابة ناجحة:", {
      url: response.config.url,
      status: response.status
    });

    const exchangeRate = response.data["Realtime Currency Exchange Rate"];
    if (!exchangeRate || !exchangeRate["5. Exchange Rate"]) {
      console.error("No exchange rate found in response:", response.data);
      return 0;
    }

    const price = parseFloat(exchangeRate["5. Exchange Rate"]);
    if (isNaN(price) || price <= 0) {
      console.error("Invalid price value:", price);
      return 0;
    }

    return price;
  } catch (error) {
    console.error("خطأ في جلب سعر الفوركس:", error);
    return 0;
  }
};