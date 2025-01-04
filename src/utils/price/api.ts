import axios from 'axios';
import { API_CONFIG, FOREX_SYMBOLS, CRYPTO_SYMBOLS } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout
});

// إضافة معترض للطلبات مع المزيد من التفاصيل
api.interceptors.request.use(
  (config) => {
    const requestDetails = {
      url: config.url,
      method: config.method,
      params: config.params,
      headers: {
        ...config.headers,
        'X-Finnhub-Token': '***' // إخفاء المفتاح في السجلات
      }
    };
    console.log('تفاصيل الطلب:', JSON.stringify(requestDetails, null, 2));
    return config;
  },
  (error) => {
    console.error('خطأ في إعداد الطلب:', {
      message: error.message,
      stack: error.stack
    });
    return Promise.reject(error);
  }
);

// تحسين معترض الاستجابات
api.interceptors.response.use(
  (response) => {
    console.log('استجابة ناجحة:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params
    };
    
    console.error('تفاصيل الخطأ الكاملة:', JSON.stringify(errorDetails, null, 2));

    // تحسين رسائل الخطأ
    if (error.code === 'ECONNABORTED') {
      throw new Error('انتهت مهلة الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('فشل الاتصال بالخدمة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    }
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('خطأ في المصادقة. يرجى التحقق من صحة مفتاح API أو تجديده.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('تم تجاوز الحد الأقصى للطلبات. يرجى الانتظار قليلاً والمحاولة مرة أخرى.');
    }

    throw new Error(`خطأ غير متوقع: ${error.message}`);
  }
);

export async function fetchForexPrice(symbol: string): Promise<number> {
  try {
    console.log(`بدء طلب سعر الفوركس للرمز ${symbol}`);
    
    const forexSymbol = FOREX_SYMBOLS[symbol as keyof typeof FOREX_SYMBOLS];
    if (!forexSymbol) {
      throw new Error(`الرمز ${symbol} غير مدعوم في الفوركس`);
    }

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
    
  } catch (error) {
    console.error(`فشل في جلب سعر الفوركس للرمز ${symbol}:`, error);
    throw error;
  }
}

export async function fetchCryptoPrice(symbol: string): Promise<number> {
  try {
    console.log(`بدء طلب سعر العملة الرقمية للرمز ${symbol}`);
    
    const cryptoSymbol = CRYPTO_SYMBOLS[symbol as keyof typeof CRYPTO_SYMBOLS];
    if (!cryptoSymbol) {
      throw new Error(`الرمز ${symbol} غير مدعوم في العملات الرقمية`);
    }

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
    
  } catch (error) {
    console.error(`فشل في جلب سعر العملة الرقمية للرمز ${symbol}:`, error);
    throw error;
  }
}