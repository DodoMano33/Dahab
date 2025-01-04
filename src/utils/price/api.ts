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
      // استخدام السعر المقدم من المستخدم في حالة وجود خطأ من API
      return response;
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
  
  // إذا تم توفير سعر من المستخدم، نستخدمه مباشرة
  if (providedPrice !== undefined) {
    console.log(`استخدام السعر المقدم من المستخدم: ${providedPrice}`);
    return providedPrice;
  }

  const cryptoSymbol = CRYPTO_SYMBOLS[symbol as keyof typeof CRYPTO_SYMBOLS];
  if (!cryptoSymbol) {
    throw new Error(`الرمز ${symbol} غير مدعوم في العملات المشفرة`);
  }

  try {
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
      if (providedPrice !== undefined) {
        return providedPrice;
      }
      throw new Error('لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً');
    }

    return parseFloat(data['5. Exchange Rate']);
  } catch (error) {
    if (providedPrice !== undefined) {
      return providedPrice;
    }
    throw new Error('حدث خطأ في جلب السعر. الرجاء إدخال السعر يدوياً');
  }
}

export async function fetchForexPrice(symbol: string, providedPrice?: number): Promise<number> {
  console.log(`بدء طلب سعر الفوركس للرمز ${symbol}`);

  // إذا تم توفير سعر من المستخدم، نستخدمه مباشرة
  if (providedPrice !== undefined) {
    console.log(`استخدام السعر المقدم من المستخدم: ${providedPrice}`);
    return providedPrice;
  }

  const forexSymbol = FOREX_SYMBOLS[symbol as keyof typeof FOREX_SYMBOLS];
  if (!forexSymbol) {
    if (symbol === 'XAUUSD' && providedPrice !== undefined) {
      return providedPrice;
    }
    throw new Error(`الرمز ${symbol} غير مدعوم في الفوركس`);
  }

  try {
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
      if (providedPrice !== undefined) {
        return providedPrice;
      }
      throw new Error('لم يتم العثور على سعر صالح. الرجاء إدخال السعر يدوياً');
    }

    return parseFloat(data['5. Exchange Rate']);
  } catch (error) {
    if (providedPrice !== undefined) {
      return providedPrice;
    }
    throw new Error('حدث خطأ في جلب السعر. الرجاء إدخال السعر يدوياً');
  }
}