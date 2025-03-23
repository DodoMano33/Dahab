
import { fetchPriceFromMetalPriceApi } from './metalPriceApi.ts';

/**
 * التحقق مما إذا كانت السوق مغلقة (السبت أو الأحد)
 */
const isMarketClosed = (): boolean => {
  const day = new Date().getDay();
  // 0 = الأحد، 6 = السبت
  return day === 0 || day === 6;
};

/**
 * جلب سعر الذهب الحالي فقط (XAUUSD) من Metal Price API
 * حسب سعر شركة CFI
 */
export async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    // تأكد من أن الرمز هو XAUUSD دائماً
    if (symbol.toUpperCase() !== 'XAUUSD') {
      console.log(`الرمز ${symbol} غير مدعوم. استخدام XAUUSD.`);
      symbol = 'XAUUSD';
    }
    
    // التحقق مما إذا كانت السوق مغلقة (السبت أو الأحد)
    if (isMarketClosed()) {
      console.log('السوق مغلقة اليوم (السبت أو الأحد). تخطي استدعاء Metal Price API.');
      return null;
    }
    
    console.log("محاولة جلب سعر الذهب من CFI عبر Metal Price API...");
    
    // استخدام Metal Price API لجلب سعر الذهب (XAU) من CFI
    const result = await fetchPriceFromMetalPriceApi('XAU');
    
    if (result.success && result.price !== null) {
      console.log(`تم جلب سعر الذهب من CFI بنجاح: ${result.price}`);
      return result.price;
    }
    
    console.error(`فشل في جلب سعر الذهب من CFI:`, result.message);
    return null;
  } catch (error: any) {
    console.error(`خطأ في جلب سعر الذهب من CFI:`, error);
    return null;
  }
}
