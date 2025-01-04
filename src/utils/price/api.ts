import axios from 'axios';
import { FINNHUB_API_KEY } from './config';

const BASE_URL = 'https://finnhub.io/api/v1';

export async function fetchForexPrice(symbol: string): Promise<number> {
  console.log(`جاري جلب سعر الفوركس للرمز ${symbol}`);
  
  try {
    const [base, quote] = [symbol.slice(0, 3), symbol.slice(3)];
    const response = await axios.get(`${BASE_URL}/forex/candle`, {
      params: {
        symbol: `OANDA:${base}_${quote}`,
        resolution: '1',
        count: 1,
        token: FINNHUB_API_KEY
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
        throw new Error(`خطأ في المصادقة للرمز ${symbol}. تأكد من صحة مفتاح API`);
      }
      if (error.response?.status === 429) {
        throw new Error(`تم تجاوز حد الطلبات للرمز ${symbol}. حاول مرة أخرى لاحقاً`);
      }
    }
    throw error;
  }
}

export async function fetchQuotePrice(symbol: string): Promise<number> {
  console.log(`جاري جلب سعر السهم للرمز ${symbol}`);
  
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: FINNHUB_API_KEY
      }
    });

    console.log(`استجابة API للرمز ${symbol}:`, response.data);

    if (!response.data.c) {
      throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
    }

    const price = response.data.c;
    console.log(`تم استخراج السعر بنجاح: ${price}`);
    return price;
  } catch (error) {
    console.error(`خطأ في جلب سعر السهم للرمز ${symbol}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error(`خطأ في المصادقة للرمز ${symbol}. تأكد من صحة مفتاح API`);
      }
      if (error.response?.status === 429) {
        throw new Error(`تم تجاوز حد الطلبات للرمز ${symbol}. حاول مرة أخرى لاحقاً`);
      }
    }
    throw error;
  }
}