import axios from 'axios';
import { API_CONFIG, FOREX_SYMBOLS, CRYPTO_SYMBOLS } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: API_CONFIG.headers,
  timeout: 10000
});

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

    console.log(`استجابة API للرمز ${symbol}:`, response.data);

    if (!response.data.c || response.data.c.length === 0) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    const price = response.data.c[response.data.c.length - 1];
    console.log(`تم استخراج السعر بنجاح: ${price}`);
    return price;
  } catch (error) {
    console.error(`خطأ في جلب سعر الفوركس للرمز ${symbol}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error(`خطأ في المصادقة للرمز ${symbol}. يرجى التحقق من صحة مفتاح API`);
      }
      if (error.response?.status === 429) {
        throw new Error(`تم تجاوز حد الطلبات للرمز ${symbol}. حاول مرة أخرى لاحقاً`);
      }
    }
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