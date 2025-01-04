import axios from 'axios';
import { API_CONFIG, FOREX_SYMBOLS, CRYPTO_SYMBOLS } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout
});

// إضافة معترض للطلبات
api.interceptors.request.use(
  (config) => {
    console.log(`إرسال طلب إلى: ${config.url}`, {
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('خطأ في إعداد الطلب:', error);
    return Promise.reject(error);
  }
);

// إضافة معترض للاستجابات
api.interceptors.response.use(
  (response) => {
    console.log(`استجابة ناجحة من: ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('خطأ في الاستجابة:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('خطأ في المصادقة. يرجى التحقق من صحة مفتاح API.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('تم تجاوز حد الطلبات. يرجى المحاولة بعد قليل.');
    }

    throw error;
  }
);

export async function fetchForexPrice(symbol: string): Promise<number> {
  console.log(`جاري جلب سعر الفوركس للرمز ${symbol}`);
  
  try {
    const forexSymbol = FOREX_SYMBOLS[symbol as keyof typeof FOREX_SYMBOLS];
    if (!forexSymbol) {
      throw new Error(`الرمز ${symbol} غير مدعوم في الفوركس`);
    }

    console.log(`استخدام رمز Finnhub: ${forexSymbol}`);
    
    const response = await api.get('/forex/candle', {
      params: {
        symbol: forexSymbol,
        resolution: '1',
        count: 1
      }
    });

    if (!response.data.c || response.data.c.length === 0) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    const price = response.data.c[response.data.c.length - 1];
    console.log(`تم استخراج السعر بنجاح: ${price}`);
    return price;
  } catch (error) {
    console.error(`خطأ في جلب سعر الفوركس للرمز ${symbol}:`, error);
    throw error;
  }
}

export async function fetchCryptoPrice(symbol: string): Promise<number> {
  console.log(`جاري جلب سعر العملة الرقمية للرمز ${symbol}`);
  
  try {
    const cryptoSymbol = CRYPTO_SYMBOLS[symbol as keyof typeof CRYPTO_SYMBOLS];
    if (!cryptoSymbol) {
      throw new Error(`الرمز ${symbol} غير مدعوم في العملات الرقمية`);
    }

    const response = await api.get('/crypto/candle', {
      params: {
        symbol: cryptoSymbol,
        resolution: '1',
        count: 1
      }
    });

    if (!response.data.c || response.data.c.length === 0) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    return response.data.c[response.data.c.length - 1];
  } catch (error) {
    console.error(`خطأ في جلب سعر العملة الرقمية للرمز ${symbol}:`, error);
    throw error;
  }
}