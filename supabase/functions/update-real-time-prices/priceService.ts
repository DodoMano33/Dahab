
import { fetchPriceFromMetalPriceApi } from './metalPriceApi.ts';

/**
 * جلب سعر الذهب الحالي فقط (XAUUSD) من شركة CFI
 */
export async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    // تأكد من أن الرمز هو XAUUSD دائماً
    if (symbol.toUpperCase() !== 'XAUUSD') {
      console.log(`الرمز ${symbol} غير مدعوم. استخدام XAUUSD.`);
      symbol = 'XAUUSD';
    }
    
    // استخدام Metal Price API لجلب سعر الذهب (XAU)
    const price = await fetchPriceFromMetalPriceApi('XAU');
    console.log(`تم جلب سعر الذهب: ${price}`);
    return price;
  } catch (error) {
    console.error(`خطأ في جلب سعر الذهب:`, error);
    return null;
  }
}
