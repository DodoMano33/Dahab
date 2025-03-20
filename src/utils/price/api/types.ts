
import { FOREX_SYMBOLS, CRYPTO_SYMBOLS, PRECIOUS_METALS } from "../config";

// أنواع الرموز
export type SymbolType = 'forex' | 'crypto' | 'precious_metal' | 'unknown';

// تكوين المعادن الثمينة
export type PreciousMetalConfig = {
  base: string;
  target: string;
};

// تكوين العملات الرقمية
export type CryptoConfig = {
  base: string;
  target: string;
};

// تكوين الفوركس
export type ForexConfig = {
  from: string;
  to: string;
};

// استجابة السعر
export interface PriceResponse {
  success: boolean;
  price: number | null;
  error?: string;
  timestamp?: number;
  message?: string; // إضافة حقل الرسالة
}

// معلومات الذاكرة المؤقتة
export interface CacheInfo {
  price: number;
  timestamp: number;
}
