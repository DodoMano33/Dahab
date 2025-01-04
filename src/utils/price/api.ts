import axios from 'axios';
import { FINNHUB_API_KEY, FOREX_ENDPOINT, QUOTE_ENDPOINT } from './config';

export async function fetchForexPrice(symbol: string): Promise<number> {
  const [base, quote] = [symbol.slice(0, 3), symbol.slice(3)];
  const response = await axios.get(FOREX_ENDPOINT, {
    params: {
      symbol: `OANDA:${base}_${quote}`,
      resolution: '1',
      count: 1,
      token: FINNHUB_API_KEY
    }
  });

  if (!response.data.c || response.data.c.length === 0) {
    throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
  }

  return response.data.c[response.data.c.length - 1];
}

export async function fetchQuotePrice(symbol: string): Promise<number> {
  const response = await axios.get(QUOTE_ENDPOINT, {
    params: {
      symbol,
      token: FINNHUB_API_KEY
    }
  });

  if (!response.data.c) {
    throw new Error(`لم يتم العثور على سعر صالح للرمز ${symbol}`);
  }

  return response.data.c;
}