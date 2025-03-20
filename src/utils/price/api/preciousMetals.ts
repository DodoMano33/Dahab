
import { PRECIOUS_METALS } from "../config";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";
import { PriceResponse } from "./types";

/**
 * جلب سعر الذهب من شركة CFI
 */
export const fetchPreciousMetalPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز والتأكد من أنه XAUUSD
    const upperSymbol = symbol.toUpperCase();
    
    // اعتبار فقط XAUUSD أو GOLD كرموز صالحة للذهب من CFI
    if (upperSymbol !== 'XAUUSD' && upperSymbol !== 'GOLD' && upperSymbol !== 'XAU') {
      console.log(`الرمز ${symbol} غير مدعوم. نستخدم فقط XAUUSD من CFI.`);
      return null;
    }
    
    // استخدام XAU دائمًا كرمز قياسي للذهب
    const symbolToFetch = 'XAU';
    
    console.log(`جلب سعر الذهب من CFI: ${symbolToFetch}`);
    
    const result = await fetchPriceFromMetalPriceApi(symbolToFetch);
    
    if (result.success && result.price !== null) {
      console.log(`تم جلب سعر الذهب بنجاح: ${result.price}`);
      return result.price;
    }
    
    console.log(`فشل في جلب سعر الذهب للرمز ${symbol}`);
    return null;
  } catch (error) {
    console.error(`خطأ في fetchPreciousMetalPrice للرمز ${symbol}:`, error);
    return null;
  }
};
