export const FINNHUB_API_KEY = 'ctsic21r01qh9oetedhgctsic21r01qh9oetedi0';

export const API_CONFIG = {
  baseUrl: 'https://finnhub.io/api/v1',
  headers: {
    'X-Finnhub-Token': FINNHUB_API_KEY
  },
  timeout: 60000 // زيادة مهلة الانتظار إلى 60 ثانية
};

export const FOREX_SYMBOLS = {
  XAUUSD: 'OANDA:XAU_USD',
  EURUSD: 'OANDA:EUR_USD',
  GBPUSD: 'OANDA:GBP_USD',
  USDJPY: 'OANDA:USD_JPY',
  USDCHF: 'OANDA:USD_CHF',
  AUDUSD: 'OANDA:AUD_USD',
  NZDUSD: 'OANDA:NZD_USD',
  USDCAD: 'OANDA:USD_CAD'
} as const;

export const CRYPTO_SYMBOLS = {
  BTCUSD: 'BINANCE:BTCUSDT',
  ETHUSD: 'BINANCE:ETHUSDT'
} as const;

export const CACHE_DURATION = 5000; // 5 seconds
export const POLLING_INTERVAL = 5000; // 5 seconds
export const MAX_RETRIES = 3; // عدد محاولات إعادة المحاولة
export const RETRY_DELAY = 2000; // التأخير بين المحاولات (2 ثواني)