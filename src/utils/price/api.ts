import axios from 'axios';
import { PriceResponse } from './types';

const ALPHA_VANTAGE_API_KEY = 'demo'; // Using demo key for now

export const fetchCryptoPrice = async (symbol: string): Promise<number> => {
  try {
    console.log("جلب سعر العملة المشفرة:", symbol);
    
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol.replace('USDT', ''),
        to_currency: 'USD',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    console.log("استجابة ناجحة:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    });

    if (response.data['Realtime Currency Exchange Rate']) {
      const price = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      if (!isNaN(price)) {
        return price;
      }
    }

    console.log("لم يتم العثور على سعر صالح، استخدام السعر المقدم");
    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  } catch (error) {
    console.error("خطأ في جلب سعر العملة المشفرة:", error);
    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  }
};

export const fetchForexPrice = async (symbol: string): Promise<number> => {
  try {
    console.log("بدء طلب سعر الفوركس للرمز", symbol);
    
    const baseCurrency = symbol.slice(0, 3);
    const quoteCurrency = symbol.slice(3, 6);

    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: baseCurrency,
        to_currency: quoteCurrency,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    console.log("استجابة ناجحة:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    });

    if (response.data['Realtime Currency Exchange Rate']) {
      const price = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      if (!isNaN(price)) {
        return price;
      }
    }

    console.log("لم يتم العثور على سعر صالح، استخدام السعر المقدم");
    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  } catch (error) {
    console.error("خطأ في جلب سعر الفوركس:", error);
    throw new Error("لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً");
  }
};

export const fetchPrice = async (symbol: string): Promise<PriceResponse> => {
  try {
    if (symbol.endsWith('USDT')) {
      const price = await fetchCryptoPrice(symbol);
      return { price, success: true };
    } else {
      const price = await fetchForexPrice(symbol);
      return { price, success: true };
    }
  } catch (error) {
    console.error("خطأ في جلب السعر:", error);
    return { 
      price: null, 
      success: false, 
      error: error instanceof Error ? error.message : "خطأ غير معروف في جلب السعر"
    };
  }
};