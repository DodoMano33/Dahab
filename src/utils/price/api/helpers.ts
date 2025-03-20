
import { METAL_PRICE_API_KEY } from "../config";
import { supabase } from "@/lib/supabase";

/**
 * الحصول على مفتاح API من التكوين أو من ملف التعريف
 */
export const getMetalPriceApiKey = (): string => {
  // استخدام المفتاح المحدد مسبقًا إذا كان متاحًا (للتطوير)
  if (METAL_PRICE_API_KEY && METAL_PRICE_API_KEY.length > 0) {
    return METAL_PRICE_API_KEY;
  }
  
  // استخدام المفتاح الثابت كخيار أخير
  return '42ed2fe2e7d1d8f688ddeb027219c766';
};

/**
 * تحويل رمز TradingView إلى رمز Metal Price API
 */
export const mapSymbolToMetalPriceSymbol = (symbol: string): string => {
  // تنظيف الرمز
  const cleanSymbol = symbol.replace('CAPITALCOM:', '').toUpperCase();
  
  // تعيين الرموز الخاصة
  const specialMappings: Record<string, string> = {
    'GOLD': 'XAU',
    'SILVER': 'XAG',
    'USOIL': 'OIL',
    'UKOIL': 'OIL'
  };
  
  if (specialMappings[cleanSymbol]) {
    return specialMappings[cleanSymbol];
  }
  
  // التعامل مع XAUUSD وما شابه
  if (cleanSymbol === 'XAUUSD') return 'XAU';
  if (cleanSymbol === 'XAGUSD') return 'XAG';
  
  // للعملات، نستخدم الجزء الأول من الرمز
  if (cleanSymbol.length === 6 && /[A-Z]{6}/.test(cleanSymbol)) {
    return cleanSymbol.substring(0, 3);
  }
  
  return cleanSymbol;
};

/**
 * تحويل رمز TradingView إلى عملة الهدف
 */
export const mapSymbolToTargetCurrency = (symbol: string): string => {
  // تنظيف الرمز
  const cleanSymbol = symbol.replace('CAPITALCOM:', '').toUpperCase();
  
  // للعملات، نستخدم الجزء الثاني من الرمز
  if (cleanSymbol.length === 6 && /[A-Z]{6}/.test(cleanSymbol)) {
    return cleanSymbol.substring(3, 6);
  }
  
  // بشكل افتراضي، نستخدم USD
  return 'USD';
};

/**
 * تحليل زوج العملات إلى عملة أساسية وعملة هدف
 */
export const parseCurrencyPair = (symbol: string): { base: string; target: string } => {
  const cleanSymbol = symbol.replace('CAPITALCOM:', '').toUpperCase();
  
  // للعملات ذات الطول 6 أحرف (مثل EURUSD)
  if (cleanSymbol.length === 6 && /[A-Z]{6}/.test(cleanSymbol)) {
    return {
      base: cleanSymbol.substring(0, 3),
      target: cleanSymbol.substring(3, 6)
    };
  }
  
  // للرموز الخاصة
  if (cleanSymbol === 'XAUUSD' || cleanSymbol === 'GOLD') {
    return { base: 'XAU', target: 'USD' };
  }
  
  if (cleanSymbol === 'XAGUSD' || cleanSymbol === 'SILVER') {
    return { base: 'XAG', target: 'USD' };
  }
  
  // الافتراضي
  return { base: cleanSymbol, target: 'USD' };
};
