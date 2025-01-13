import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { PriceResponse } from './types';

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
    throw new Error("فشل في الوصول إلى مفتاح API");
  }
};

export const fetchCryptoPrice = async (symbol: string): Promise<number> => {
  try {
    console.log("جلب سعر العملة المشفرة:", symbol);
    
    const apiKey = await getAlphaVantageKey();
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol.replace('USDT', ''),
        to_currency: 'USD',
        apikey: apiKey
      }
    });

    console.log("استجابة ناجحة:", {
      url: response.config.url,
      status: response.status
    });

    if (response.data['Realtime Currency Exchange Rate']) {
      const price = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      if (!isNaN(price)) {
        return price;
      }
    }

    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  } catch (error) {
    console.error("خطأ في جلب سعر العملة المشفرة:", error);
    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  }
};

export const fetchForexPrice = async (symbol: string): Promise<number> => {
  try {
    console.log("محاولة جلب سعر الفوركس:", symbol);
    
    const apiKey = await getAlphaVantageKey();
    const baseCurrency = symbol.slice(0, 3);
    const quoteCurrency = symbol.slice(3, 6);

    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: baseCurrency,
        to_currency: quoteCurrency,
        apikey: apiKey
      }
    });

    console.log("استجابة ناجحة:", {
      url: response.config.url,
      status: response.status
    });

    if (response.data['Realtime Currency Exchange Rate']) {
      const price = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      if (!isNaN(price)) {
        return price;
      }
    }

    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  } catch (error) {
    console.error("خطأ في جلب سعر الفوركس:", error);
    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  }
};

export const fetchPrice = async (symbol: string): Promise<PriceResponse> => {
  try {
    let price: number;
    if (symbol.endsWith('USDT')) {
      price = await fetchCryptoPrice(symbol);
    } else {
      price = await fetchForexPrice(symbol);
    }
    return { price, success: true };
  } catch (error) {
    console.error("خطأ في جلب السعر:", error);
    return { 
      price: null, 
      success: false, 
      error: error instanceof Error ? error.message : "خطأ غير معروف في جلب السعر"
    };
  }
};