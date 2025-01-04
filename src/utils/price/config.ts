export const FINNHUB_API_KEY = 'ctlsb91r01qv7qq38es0ctlsb91r01qv7qq38esg';

export const API_CONFIG = {
  baseUrl: 'https://finnhub.io/api/v1',
  headers: {
    'X-Finnhub-Token': FINNHUB_API_KEY
  }
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