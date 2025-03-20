
import { fetchPriceFromMetalPriceApi } from './metalPriceApi';
import { rateLimit } from './rateLimit';
import { getStoredPrice } from './helpers';
import { PRECIOUS_METALS } from '../config';
import { fetchPreciousMetalPrice } from './preciousMetals';

/**
 * جلب سعر العملات الأجنبية
 */
export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تحقق من حدود الاستخدام
    if (rateLimit.isRateLimited()) {
      console.log('تم تجاوز حد معدل الاستخدام. استخدام السعر المخزن.');
      return await fetchStoredPrice(symbol);
    }

    // ملاحظة: للتبسيط، نقوم دائمًا بإرجاع سعر الذهب بغض النظر عن الرمز
    console.log(`تحويل ${symbol} إلى XAUUSD للحصول على سعر الذهب`);
    return await fetchPreciousMetalPrice('XAUUSD');
  } catch (error) {
    console.error(`خطأ في fetchForexPrice: ${error}`);
    return null;
  }
};

/**
 * جلب سعر العملات المشفرة
 */
export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تحقق من حدود الاستخدام
    if (rateLimit.isRateLimited()) {
      console.log('تم تجاوز حد معدل الاستخدام. استخدام السعر المخزن.');
      return await fetchStoredPrice(symbol);
    }

    // ملاحظة: للتبسيط، نقوم دائمًا بإرجاع سعر الذهب بغض النظر عن الرمز
    console.log(`تحويل ${symbol} إلى XAUUSD للحصول على سعر الذهب`);
    return await fetchPreciousMetalPrice('XAUUSD');
  } catch (error) {
    console.error(`خطأ في fetchCryptoPrice: ${error}`);
    return null;
  }
};

/**
 * جلب سعر المعادن الثمينة (مثل الذهب والفضة)
 * من Metal Price API
 */
export { fetchPreciousMetalPrice } from './preciousMetals';

/**
 * جلب السعر المخزن في قاعدة البيانات
 */
export const fetchStoredPrice = async (symbol: string): Promise<number | null> => {
  try {
    // نقوم دائمًا بالبحث عن XAUUSD بغض النظر عن الرمز المقدم
    const storedPrice = await getStoredPrice('XAUUSD');
    
    if (storedPrice !== null) {
      console.log(`تم استخدام سعر الذهب المخزن: ${storedPrice}`);
      return storedPrice;
    }
    
    console.log(`لم يتم العثور على سعر الذهب المخزن، محاولة جلبه مباشرة...`);
    return await fetchPreciousMetalPrice('XAUUSD');
  } catch (error) {
    console.error(`خطأ في fetchStoredPrice: ${error}`);
    return null;
  }
};
