
// مفتاح API لـ Metal Price API - تم تعطيله مؤقتاً
export const METAL_PRICE_API_KEY = ''; // تم إزالة المفتاح بناءً على طلب المستخدم
export const METAL_PRICE_API_URL = 'https://api.metalpriceapi.com/v1';

// تعريف رموز الفوركس المدعومة وتنسيقها
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

// تعريف رموز العملات الرقمية المدعومة وتنسيقها
export const CRYPTO_SYMBOLS = {
  'BTC': { base: 'BTC', target: 'USD' },
  'ETH': { base: 'ETH', target: 'USD' },
  'BTCUSD': { base: 'BTC', target: 'USD' },
  'ETHUSD': { base: 'ETH', target: 'USD' }
} as const;

// تعريف رموز المعادن الثمينة المدعومة
export const PRECIOUS_METALS = {
  'XAU': { base: 'XAU', target: 'USD' },  // الذهب
  'GOLD': { base: 'XAU', target: 'USD' },  // الذهب (اسم بديل)
  'XAUUSD': { base: 'XAU', target: 'USD' }, // الذهب/دولار
  'XAG': { base: 'XAG', target: 'USD' },   // الفضة
  'XAGUSD': { base: 'XAG', target: 'USD' }, // الفضة/دولار
} as const;

// إعدادات الاستطلاع
export const POLLING_INTERVAL = 60000; // 1 دقيقة بالمللي ثانية
