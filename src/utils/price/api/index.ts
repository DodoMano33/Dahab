
// تصدير الأنواع من ملفات API المختلفة
export * from './types';
export * from './helpers';
export * from './rateLimit';

// تصدير دوال جلب الأسعار الرئيسية
export { fetchPriceFromMetalPriceApi } from './metalPriceApi';
export { fetchForexPrice, fetchCryptoPrice, fetchPreciousMetalPrice, fetchStoredPrice } from './fetchers';

// جلب سعر الذهب (XAUUSD) من CFI
import { fetchPreciousMetalPrice } from './preciousMetals';
import { mapSymbolToMetalPriceSymbol } from './helpers';

/**
 * جلب سعر الذهب فقط (XAUUSD) من شركة CFI
 */
export const fetchPrice = async (symbol: string): Promise<number | null> => {
  try {
    console.log(`بدء جلب سعر الذهب للرمز: ${symbol}`);
    
    // تنظيف الرمز
    const cleanSymbol = symbol.replace('CAPITALCOM:', '').toUpperCase();
    
    // نسمح فقط بـ XAUUSD, GOLD, أو XAU
    if (cleanSymbol === 'XAUUSD' || cleanSymbol === 'GOLD' || cleanSymbol === 'XAU') {
      console.log(`جلب سعر الذهب من CFI للرمز: ${cleanSymbol}`);
      return await fetchPreciousMetalPrice(cleanSymbol);
    }
    
    // إذا كان الرمز غير مدعوم، نرجع XAUUSD على أي حال
    console.log(`الرمز ${cleanSymbol} غير مدعوم. استخدام XAUUSD بدلاً منه.`);
    return await fetchPreciousMetalPrice('XAUUSD');
  } catch (error) {
    console.error(`خطأ في جلب سعر الذهب للرمز ${symbol}:`, error);
    return null;
  }
};
