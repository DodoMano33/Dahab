import axios from 'axios';
import { ALPHA_VANTAGE_API_KEY } from './config';
import { FOREX_SYMBOLS, CRYPTO_SYMBOLS } from './config';

const api = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
});

api.interceptors.request.use(
  (config) => {
    console.log('إرسال طلب:', {
      url: config.url,
      method: config.method,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('خطأ في إرسال الطلب:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('استجابة ناجحة:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    
    if (response.data && response.data.Note) {
      console.log('تم تجاوز حد API:', response.data.Note);
      throw new Error('API rate limit exceeded');
    }
    
    return response;
  },
  (error) => {
    console.error('خطأ في الاستجابة:', error);
    return Promise.reject(error);
  }
);

export async function fetchCryptoPrice(symbol: string, providedPrice?: number): Promise<number> {
  console.log(`بدء طلب سعر العملة المشفرة للرمز ${symbol}`);
  
  if (providedPrice !== undefined) {
    console.log(`استخدام السعر المقدم من المستخدم: ${providedPrice}`);
    return providedPrice;
  }

  try {
    // Remove 'USDT' from the symbol if it exists
    const baseSymbol = symbol.replace('USDT', '');
    const cryptoSymbol = CRYPTO_SYMBOLS[baseSymbol as keyof typeof CRYPTO_SYMBOLS] || baseSymbol;

    console.log(`جلب سعر العملة المشفرة: ${cryptoSymbol}/USD`);

    const response = await api.get('', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: cryptoSymbol,
        to_currency: 'USD',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const data = response.data['Realtime Currency Exchange Rate'];
    if (!data || !data['5. Exchange Rate']) {
      console.log('لم يتم العثور على سعر صالح، استخدام السعر المقدم');
      if (providedPrice !== undefined) {
        return providedPrice;
      }
      throw new Error('لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً');
    }

    const price = parseFloat(data['5. Exchange Rate']);
    console.log(`تم جلب السعر بنجاح: ${price}`);
    return price;
  } catch (error) {
    console.error('خطأ في جلب سعر العملة المشفرة:', error);
    if (providedPrice !== undefined) {
      return providedPrice;
    }
    throw error;
  }
}

export async function fetchForexPrice(symbol: string, providedPrice?: number): Promise<number> {
  console.log(`بدء طلب سعر الفوركس للرمز ${symbol}`);

  if (providedPrice !== undefined) {
    console.log(`استخدام السعر المقدم من المستخدم: ${providedPrice}`);
    return providedPrice;
  }

  try {
    const forexSymbol = FOREX_SYMBOLS[symbol as keyof typeof FOREX_SYMBOLS];
    if (!forexSymbol) {
      if (symbol === 'XAUUSD' && providedPrice !== undefined) {
        return providedPrice;
      }
      throw new Error(`الرمز ${symbol} غير مدعوم في الفوركس`);
    }

    const response = await api.get('', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: forexSymbol.from,
        to_currency: forexSymbol.to,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const data = response.data['Realtime Currency Exchange Rate'];
    if (!data || !data['5. Exchange Rate']) {
      console.log('لم يتم العثور على سعر صالح، استخدام السعر المقدم');
      if (providedPrice !== undefined) {
        return providedPrice;
      }
      throw new Error('لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً');
    }

    const price = parseFloat(data['5. Exchange Rate']);
    console.log(`تم جلب السعر بنجاح: ${price}`);
    return price;
  } catch (error) {
    console.error('خطأ في جلب سعر الفوركس:', error);
    if (providedPrice !== undefined) {
      return providedPrice;
    }
    throw error;
  }
}