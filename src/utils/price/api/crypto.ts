
import { rateLimit } from './rateLimit';
import { getStoredPrice } from './helpers';
import { fetchPriceFromMetalPriceApi } from './metalPriceApi';

/**
 * جلب سعر العملات المشفرة من Crypto API
 * (نستخدم Metal Price API للذهب فقط في هذه النسخة)
 */
export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تحقق من حدود معدل الاستخدام
    if (rateLimit.isRateLimited()) {
      console.log('تم تجاوز حد معدل الاستخدام لـ Crypto API. استخدام السعر المخزن.');
      const storedPrice = await getStoredPrice('XAUUSD');
      return storedPrice;
    }
    
    // للتبسيط، سنتعامل فقط مع XAUUSD (الذهب) من Metal Price API
    console.log(`تحويل جميع الرموز إلى XAUUSD للذهب`);
    const result = await fetchPriceFromMetalPriceApi('XAU');
    
    if (result.success && result.price !== null) {
      console.log(`تم استلام سعر الذهب من Metal Price API: ${result.price}`);
      return result.price;
    }
    
    // إذا فشلت عملية جلب السعر، حاول استخدام سعر مخزن
    console.log('فشل استلام السعر من Metal Price API. محاولة استخدام سعر مخزن.');
    const storedPrice = await getStoredPrice('XAUUSD');
    return storedPrice;
  } catch (error) {
    console.error(`خطأ في fetchCryptoPrice: ${error}`);
    return null;
  }
};
