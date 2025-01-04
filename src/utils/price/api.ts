import axios from 'axios';
import { API_CONFIG, FOREX_SYMBOLS, CRYPTO_SYMBOLS, MAX_RETRIES, RETRY_DELAY } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout
});

// دالة مساعدة للانتظار
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// دالة إعادة المحاولة
const retryRequest = async (fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`محاولة إعادة الطلب. المحاولات المتبقية: ${retries}`);
      await wait(RETRY_DELAY);
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// إضافة معترض للطلبات
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
    console.error('خطأ في إعداد الطلب:', error);
    return Promise.reject(error);
  }
);

// تحسين معترض الاستجابات
api.interceptors.response.use(
  (response) => {
    console.log('استجابة ناجحة:', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    console.error('تفاصيل الخطأ:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.code === 'ECONNABORTED') {
      throw new Error('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.');
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('فشل الاتصال بالخدمة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    }

    if (error.response?.status === 429) {
      throw new Error('تم تجاوز حد الطلبات. يرجى الانتظار قليلاً والمحاولة مرة أخرى.');
    }

    throw new Error(error.response?.data?.error || error.message || 'حدث خطأ غير متوقع');
  }
);

export async function fetchForexPrice(symbol: string): Promise<number> {
  console.log(`بدء طلب سعر الفوركس للرمز ${symbol}`);
  
  const forexSymbol = FOREX_SYMBOLS[symbol as keyof typeof FOREX_SYMBOLS];
  if (!forexSymbol) {
    throw new Error(`الرمز ${symbol} غير مدعوم في الفوركس`);
  }

  return retryRequest(async () => {
    const params = {
      symbol: forexSymbol,
      resolution: '1',
      count: 1
    };
    
    console.log(`إرسال طلب Finnhub مع المعلمات:`, params);
    
    const response = await api.get('/forex/candle', { params });

    if (!response.data.c || response.data.c.length === 0) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    const price = response.data.c[response.data.c.length - 1];
    console.log(`تم استلام السعر بنجاح للرمز ${symbol}: ${price}`);
    return price;
  });
}

export async function fetchCryptoPrice(symbol: string): Promise<number> {
  console.log(`بدء طلب سعر العملة الرقمية للرمز ${symbol}`);
  
  const cryptoSymbol = CRYPTO_SYMBOLS[symbol as keyof typeof CRYPTO_SYMBOLS];
  if (!cryptoSymbol) {
    throw new Error(`الرمز ${symbol} غير مدعوم في العملات الرقمية`);
  }

  return retryRequest(async () => {
    const params = {
      symbol: cryptoSymbol,
      resolution: '1',
      count: 1
    };
    
    console.log(`إرسال طلب Finnhub مع المعلمات:`, params);
    
    const response = await api.get('/crypto/candle', { params });

    if (!response.data.c || response.data.c.length === 0) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    const price = response.data.c[response.data.c.length - 1];
    console.log(`تم استلام السعر بنجاح للرمز ${symbol}: ${price}`);
    return price;
  });
}