import axios from 'axios';
import { ALPHA_VANTAGE_API_KEY } from './config';
import { FOREX_SYMBOLS, CRYPTO_SYMBOLS } from './config';

// إنشاء نسخة من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
});

// إضافة معترضات للطلبات
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

// إضافة معترضات للاستجابات
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
    console.error('خطأ في الاستجابة:', error);
    return Promise.reject(error);
  }
);

export async function fetchCryptoPrice(symbol: string): Promise<number> {
  console.log(`بدء طلب سعر العملة المشفرة للرمز ${symbol}`);
  
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
      throw new Error('بيانات غير صالحة من API');
    }

    return parseFloat(data['5. Exchange Rate']);
  } catch (error) {
    console.error('خطأ في جلب سعر العملة المشفرة:', error);
    throw error;
  }
}

export async function fetchForexPrice(symbol: string): Promise<number> {
  console.log(`بدء طلب سعر الفوركس للرمز ${symbol}`);

  const forexSymbol = FOREX_SYMBOLS[symbol as keyof typeof FOREX_SYMBOLS];
  if (!forexSymbol) {
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
      throw new Error('بيانات غير صالحة من API');
    }

    return parseFloat(data['5. Exchange Rate']);
  } catch (error) {
    console.error('خطأ في جلب سعر الفوركس:', error);
    throw error;
  }
}