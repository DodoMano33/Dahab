
import { PriceResponse } from './types';

/**
 * جلب سعر المعادن من Metal Price API
 * يستخدم XAU/USD فقط للذهب من CFI
 */
export const fetchPriceFromMetalPriceApi = async (symbol: string): Promise<PriceResponse> => {
  try {
    // تنسيق الرمز للاستخدام مع API
    const symbolToUse = symbol.toUpperCase();
    
    // في هذه النسخة، نقبل فقط XAU للذهب
    if (symbolToUse !== 'XAU') {
      console.log(`الرمز ${symbol} غير مدعوم، استخدام XAU للذهب من CFI`);
      return { success: false, price: null, message: 'الرمز غير مدعوم' };
    }
    
    console.log(`جلب سعر الذهب من CFI للرمز: ${symbolToUse}`);
    
    // استخدم API Metal Price للحصول على سعر الذهب (XAU/USD) من CFI
    const apiKey = '42ed2fe2e7d1d8f688ddeb027219c766'; // المفتاح المقدم من المستخدم
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU`;
    
    console.log(`الاتصال بـ Metal Price API: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      console.error(`فشل الاتصال بـ Metal Price API: ${response.status} ${response.statusText}`);
      throw new Error(`فشل الاتصال بـ Metal Price API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("بيانات المستلمة من Metal Price API:", data);
    
    if (data.success && data.rates && data.rates.XAU) {
      // Metal Price API يعطي سعر XAU بالدولار، لكننا نحتاج USD/XAU للتوافق
      // نقوم بحساب المقلوب (1/سعر) للحصول على سعر XAUUSD المعتاد
      const xauPrice = 1 / data.rates.XAU;
      console.log(`تم استلام سعر الذهب: 1 XAU = ${xauPrice} USD`);
      
      return { 
        success: true, 
        price: xauPrice,
        message: 'تم استلام السعر بنجاح' 
      };
    } else {
      console.error('لم يتم العثور على بيانات سعر صالحة في استجابة API:', data);
      return { 
        success: false, 
        price: null,
        message: 'بيانات السعر غير صالحة في استجابة API' 
      };
    }
  } catch (error: any) {
    console.error(`خطأ في جلب سعر المعادن:`, error);
    return { 
      success: false, 
      price: null,
      message: `خطأ: ${error.message || 'خطأ غير معروف'}` 
    };
  }
};
