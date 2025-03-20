
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
  
  // يمكن تنفيذ طريقة الحصول على المفتاح من ملف التعريف لاحقًا
  // عندما نريد السماح للمستخدمين بإدخال مفاتيحهم الخاصة
  
  return METAL_PRICE_API_KEY || '';
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
