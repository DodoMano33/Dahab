
import { 
  METAL_PRICE_API_KEY, 
  FOREX_SYMBOLS, 
  CRYPTO_SYMBOLS, 
  PRECIOUS_METALS 
} from "../config";
import { SymbolType } from "./types";

/**
 * الحصول على مفتاح API
 */
export const getMetalPriceApiKey = async (): Promise<string> => {
  console.log("استخدام مفتاح Metal Price API المكوّن مسبقاً");
  return METAL_PRICE_API_KEY;
};

/**
 * التحقق من نوع الرمز وإرجاع تصنيفه
 */
export const getSymbolType = (symbol: string): SymbolType => {
  const upperSymbol = symbol.toUpperCase();
  
  if (PRECIOUS_METALS[upperSymbol as keyof typeof PRECIOUS_METALS]) {
    return 'precious_metal';
  }
  
  if (FOREX_SYMBOLS[upperSymbol as keyof typeof FOREX_SYMBOLS]) {
    return 'forex';
  }
  
  if (CRYPTO_SYMBOLS[upperSymbol as keyof typeof CRYPTO_SYMBOLS]) {
    return 'crypto';
  }
  
  // محاولة تخمين النوع من تنسيق الرمز إذا لم يكن معرفًا مسبقًا
  if (upperSymbol.includes('USD') || upperSymbol.length === 6) {
    return 'forex';
  }
  
  if (['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'DOT', 'ADA'].includes(upperSymbol)) {
    return 'crypto';
  }
  
  return 'unknown';
};

/**
 * تحويل زوج عملات إلى الأجزاء المكونة له
 */
export const parseCurrencyPair = (symbol: string): { base: string, target: string } => {
  const upperSymbol = symbol.toUpperCase();
  
  // إذا كان طول الرمز ستة أحرف، نفترض أنه زوج فوركس
  if (upperSymbol.length === 6) {
    return {
      base: upperSymbol.substring(0, 3),
      target: upperSymbol.substring(3, 6)
    };
  }
  
  // إذا كان يحتوي على USD، نفترض أنه عملة رقمية
  if (upperSymbol.includes('USD')) {
    return {
      base: upperSymbol.replace('USD', ''),
      target: 'USD'
    };
  }
  
  // الافتراضي
  return {
    base: upperSymbol,
    target: 'USD'
  };
};
