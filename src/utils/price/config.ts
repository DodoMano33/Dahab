export const ALPHA_VANTAGE_API_KEY = 'demo'; // استخدام المفتاح المجاني للتجربة

export const API_CONFIG = {
  baseUrl: 'https://www.alphavantage.co/query',
  timeout: 5000 // 5 seconds timeout
};

export const FOREX_SYMBOLS = {
  XAUUSD: 'XAU/USD',
  EURUSD: 'EUR/USD',
  GBPUSD: 'GBP/USD',
  USDJPY: 'USD/JPY',
  USDCHF: 'USD/CHF',
  AUDUSD: 'AUD/USD',
  NZDUSD: 'NZD/USD',
  USDCAD: 'USD/CAD'
} as const;

export const CRYPTO_SYMBOLS = {
  BTCUSD: 'BTC/USD',
  ETHUSD: 'ETH/USD'
} as const;

export const CACHE_DURATION = 5000; // 5 seconds
export const POLLING_INTERVAL = 5000; // 5 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 2000; // 2 seconds delay between retries