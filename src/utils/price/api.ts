import axios from 'axios';
import { ALPHA_VANTAGE_API_KEY } from './config';

export const fetchForexPrice = async (symbol: string): Promise<number> => {
  try {
    console.log("بدء طلب سعر الفوركس للرمز", symbol);

    // تحليل رمز العملة إلى عملتين
    let fromCurrency, toCurrency;
    if (symbol === 'XAUUSD') {
      fromCurrency = 'XAU';
      toCurrency = 'USD';
    } else {
      fromCurrency = symbol.slice(0, 3);
      toCurrency = symbol.slice(3, 6);
    }

    const requestConfig = {
      url: 'https://www.alphavantage.co/query',
      method: 'get',
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    };

    console.log("إرسال طلب:", requestConfig);

    const response = await axios(requestConfig);
    console.log("استجابة ناجحة:", {
      url: requestConfig.url,
      status: response.status,
      data: response.data
    });

    const data = response.data;
    if (!data || !data['Realtime Currency Exchange Rate'] || !data['Realtime Currency Exchange Rate']['5. Exchange Rate']) {
      console.error("بيانات السعر غير صالحة:", data);
      throw new Error("بيانات السعر غير صالحة في الاستجابة");
    }

    const price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    return price;
  } catch (error) {
    console.error("خطأ في جلب سعر الفوركس:", error);
    throw new Error("حدث خطأ في جلب السعر. الرجاء إدخال السعر يدوياً");
  }
};

export const fetchCryptoPrice = async (symbol: string): Promise<number> => {
  try {
    const crypto = symbol.slice(0, -3);
    const requestConfig = {
      url: 'https://www.alphavantage.co/query',
      method: 'get',
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: crypto,
        to_currency: 'USD',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    };

    const response = await axios(requestConfig);
    const data = response.data;

    if (!data || !data['Realtime Currency Exchange Rate'] || !data['Realtime Currency Exchange Rate']['5. Exchange Rate']) {
      throw new Error("بيانات السعر غير صالحة في الاستجابة");
    }

    return parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
  } catch (error) {
    console.error("خطأ في جلب سعر العملة المشفرة:", error);
    throw new Error("حدث خطأ في جلب السعر. الرجاء إدخال السعر يدوياً");
  }
};