export const ALPHA_VANTAGE_API_KEY = 'demo';

export const SUPPORTED_TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'] as const;
export type TimeFrame = typeof SUPPORTED_TIMEFRAMES[number];

export const PRICE_UPDATE_INTERVAL = 60000; // تحديث كل دقيقة