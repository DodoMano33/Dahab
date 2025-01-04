import axios from 'axios';
import { API_CONFIG, FOREX_SYMBOLS, CRYPTO_SYMBOLS, MAX_RETRIES, RETRY_DELAY, ALPHA_VANTAGE_API_KEY } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
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
      status: response.status,
      data: response.data
    });
    
    // التحقق من وجود رسالة خطأ في الاستجابة
    if (response.data && response.data.Note) {
      throw new Error(`خطأ من Alpha Vantage: ${response.data.Note}`);
    }
    
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

    throw new Error(error.response?.data?.error || error.message || 'حدث خطأ غير متوقع');
  }
);

export async function fetchForexPrice(symbol: string): Promise<number> {
  console.log(`بدء طلب سعر الفوركس للرمز ${symbol}`);
  
  // للمفتاح المجاني، نقوم بإرجاع سعر افتراضي للذهب
  if (ALPHA_VANTAGE_API_KEY === 'demo' && symbol === 'XAUUSD') {
    console.log('استخدام سعر افتراضي للذهب مع المفتاح المجاني');
    return 2000.00;
  }

  const forexSymbol = FOREX_SYMBOLS[symbol as keyof typeof FOREX_SYMBOLS];
  if (!forexSymbol) {
    throw new Error(`الرمز ${symbol} غير مدعوم في الفوركس`);
  }

  const [fromCurrency, toCurrency] = forexSymbol.split('/');

  return retryRequest(async () => {
    const params = {
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: fromCurrency,
      to_currency: toCurrency,
      apikey: ALPHA_VANTAGE_API_KEY
    };
    
    console.log(`إرسال طلب Alpha Vantage مع المعلمات:`, params);
    
    const response = await api.get('', { params });
    const data = response.data['Realtime Currency Exchange Rate'];
    
    if (!data || !data['5. Exchange Rate']) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    const price = parseFloat(data['5. Exchange Rate']);
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

  const [fromCurrency, toCurrency] = cryptoSymbol.split('/');

  return retryRequest(async () => {
    const params = {
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: fromCurrency,
      to_currency: toCurrency,
      apikey: ALPHA_VANTAGE_API_KEY
    };
    
    console.log(`إرسال طلب Alpha Vantage مع المعلمات:`, params);
    
    const response = await api.get('', { params });
    const data = response.data['Realtime Currency Exchange Rate'];
    
    if (!data || !data['5. Exchange Rate']) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    const price = parseFloat(data['5. Exchange Rate']);
    console.log(`تم استلام السعر بنجاح للرمز ${symbol}: ${price}`);
    return price;
  });
}