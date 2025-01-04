export const FINNHUB_API_KEY = 'cg0vhqpr01qv7qq38f3gcg0vhqpr01qv7qq38f3g';

export const POLLING_INTERVAL = 5000; // 5 seconds
export const CACHE_DURATION = 5000; // 5 seconds

export const FOREX_ENDPOINT = 'https://finnhub.io/api/v1/forex/candle';
export const QUOTE_ENDPOINT = 'https://finnhub.io/api/v1/quote';

export const SUPPORTED_SYMBOLS = [
  'XAUUSD',
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'USDCHF',
  'AUDUSD',
  'NZDUSD',
  'USDCAD',
  'BTCUSD',
  'ETHUSD'
] as const;