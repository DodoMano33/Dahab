
import { fetchCryptoPrice } from './cryptoPrice';
import { fetchForexPrice, fetchGoldPrice } from './forexPrice';
import { getAlphaVantageKey } from './apiKey';
import { isApiRateLimited } from './rateLimit';

export {
  fetchCryptoPrice,
  fetchForexPrice,
  fetchGoldPrice,
  getAlphaVantageKey,
  isApiRateLimited
};
