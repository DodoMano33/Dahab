export const ALPHA_VANTAGE_API_KEY = 'demo';

export const FOREX_SYMBOLS = {
  'EURUSD': { from: 'EUR', to: 'USD' },
  'GBPUSD': { from: 'GBP', to: 'USD' },
  'USDJPY': { from: 'USD', to: 'JPY' },
  'USDCHF': { from: 'USD', to: 'CHF' },
  'AUDUSD': { from: 'AUD', to: 'USD' },
  'NZDUSD': { from: 'NZD', to: 'USD' },
  'USDCAD': { from: 'USD', to: 'CAD' },
  'XAUUSD': { from: 'XAU', to: 'USD' }
} as const;

export const CRYPTO_SYMBOLS = {
  'BTC': 'BTC',
  'ETH': 'ETH',
  'BTCUSDT': 'BTC'
} as const;

export const CACHE_DURATION = 5000; // 5 seconds
export const POLLING_INTERVAL = 5000; // 5 seconds