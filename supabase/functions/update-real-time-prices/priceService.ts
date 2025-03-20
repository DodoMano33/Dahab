
import { fetchPriceFromMetalPriceApi } from './metalPriceApi.ts';

/**
 * جلب سعر الذهب الحالي فقط (XAUUSD) من Metal Price API
 */
export async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    // تأكد من أن الرمز هو XAUUSD دائماً
    if (symbol.toUpperCase() !== 'XAUUSD') {
      console.log(`الرمز ${symbol} غير مدعوم. استخدام XAUUSD.`);
      symbol = 'XAUUSD';
    }
    
    // استخدام Metal Price API لجلب سعر الذهب (XAU)
    const result = await fetchPriceFromMetalPriceApi('XAU');
    
    if (result.success && result.price !== null) {
      console.log(`تم جلب سعر الذهب: ${result.price}`);
      return result.price;
    }
    
    console.error(`فشل في جلب سعر الذهب من Metal Price API:`, result.message);
    return null;
  } catch (error) {
    console.error(`خطأ في جلب سعر الذهب:`, error);
    return null;
  }
}
