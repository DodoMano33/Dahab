
import { supabase } from "@/lib/supabase";
import { rateLimit } from "./rateLimit";
import { getStoredPrice } from "./helpers";
import { fetchPriceFromMetalPriceApi } from "./metalPriceApi";
import { PriceResponse } from "./types";

/**
 * جلب سعر الذهب فقط (XAUUSD) من CFI
 */
export const fetchPreciousMetalPrice = async (symbol: string): Promise<number | null> => {
  try {
    console.log(`جلب سعر الذهب من CFI: ${symbol}`);
    
    // تحويل الرمز المعطى إلى رمز XAU للذهب فقط
    const metalSymbol = symbol.toUpperCase().includes('XAU') || 
                        symbol.toUpperCase().includes('GOLD') 
                        ? 'XAU' : null;
    
    if (!metalSymbol) {
      console.warn(`الرمز ${symbol} غير مدعوم. نحن ندعم فقط XAU (الذهب) من CFI`);
      return null;
    }
    
    // التحقق من حالة حد معدل الاستخدام
    if (rateLimit.isRateLimited()) {
      console.log('تم تجاوز حد معدل الاستخدام لـ Metal Price API. محاولة استخدام السعر المخزن.');
      
      // محاولة استخدام السعر المخزن
      const storedPrice = await getStoredPrice('XAUUSD');
      if (storedPrice !== null) {
        console.log(`استخدام سعر الذهب المخزن من CFI: ${storedPrice}`);
        return storedPrice;
      }
      
      console.log('لم يتم العثور على سعر مخزن للذهب من CFI.');
      return null;
    }
    
    // استخدام Metal Price API مباشرة لجلب سعر الذهب من CFI
    const response: PriceResponse = await fetchPriceFromMetalPriceApi(metalSymbol);
    
    if (response.success && response.price !== null) {
      console.log(`تم جلب سعر الذهب من CFI: ${response.price}`);
      
      // حفظ السعر في قاعدة البيانات
      try {
        const { error } = await supabase
          .from('real_time_prices')
          .upsert({ 
            symbol: 'XAUUSD', 
            price: response.price,
            updated_at: new Date().toISOString() 
          }, { 
            onConflict: 'symbol' 
          });
        
        if (error) {
          console.error('خطأ في حفظ سعر الذهب من CFI في قاعدة البيانات:', error);
        } else {
          console.log('تم حفظ سعر الذهب من CFI في قاعدة البيانات');
          
          // إرسال حدث تحديث السعر
          window.dispatchEvent(new CustomEvent('metal-price-update', {
            detail: { price: response.price, symbol: 'XAUUSD' }
          }));
        }
      } catch (saveError) {
        console.error('خطأ غير متوقع في حفظ سعر الذهب من CFI:', saveError);
      }
      
      return response.price;
    }
    
    // إذا لم ننجح في الحصول على السعر من Metal Price API، نستخدم السعر المخزن
    console.warn('لم ننجح في جلب سعر الذهب من CFI. محاولة استخدام السعر المخزن.');
    const storedPrice = await getStoredPrice('XAUUSD');
    
    if (storedPrice !== null) {
      console.log(`استخدام سعر الذهب المخزن من CFI: ${storedPrice}`);
      return storedPrice;
    }
    
    console.log('لم يتم العثور على سعر للذهب من CFI');
    return null;
  } catch (error) {
    console.error('خطأ في جلب سعر الذهب من CFI:', error);
    
    // محاولة استخدام السعر المخزن
    try {
      const storedPrice = await getStoredPrice('XAUUSD');
      if (storedPrice !== null) {
        console.log(`استخدام سعر الذهب المخزن من CFI بعد خطأ: ${storedPrice}`);
        return storedPrice;
      }
    } catch (subError) {
      console.error('خطأ في جلب السعر المخزن بعد فشل جلب السعر الحي من CFI:', subError);
    }
    
    return null;
  }
};

/**
 * جلب سعر من الفوركس (غير مستخدم حالياً)
 */
export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  console.log(`فوركس غير مدعوم، تحويل إلى XAUUSD من CFI`);
  return fetchPreciousMetalPrice('XAUUSD');
};

/**
 * جلب سعر العملات الرقمية (غير مستخدم حالياً)
 */
export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  console.log(`العملات الرقمية غير مدعومة، تحويل إلى XAUUSD من CFI`);
  return fetchPreciousMetalPrice('XAUUSD');
};

/**
 * جلب السعر المخزن
 */
export const fetchStoredPrice = async (symbol: string): Promise<number | null> => {
  // دائماً جلب سعر الذهب فقط
  return getStoredPrice('XAUUSD');
};
