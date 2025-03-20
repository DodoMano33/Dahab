
interface PriceResponse {
  success: boolean;
  price: number | null;
  message: string;
}

/**
 * جلب سعر المعادن من Metal Price API
 * يستخدم XAU/USD فقط للذهب
 */
export const fetchPriceFromMetalPriceApi = async (symbol: string): Promise<PriceResponse> => {
  try {
    // تنسيق الرمز للاستخدام مع API
    const symbolToUse = symbol.toUpperCase();
    
    // في هذه النسخة، نقبل فقط XAU للذهب
    if (symbolToUse !== 'XAU') {
      console.log(`الرمز ${symbol} غير مدعوم، استخدام XAU للذهب`);
      return { success: false, price: null, message: 'الرمز غير مدعوم' };
    }
    
    console.log(`جلب سعر الذهب من Metal Price API للرمز: ${symbolToUse}`);
    
    // استخدم API Metal Price للحصول على سعر الذهب (XAU/USD)
    const apiKey = '8f39d08df9d1c0df6c55fa0ce4c03574'; // مفتاح API (وهمي/تجريبي)
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU`;
    
    console.log(`الاتصال بـ Metal Price API: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`فشل الاتصال بـ Metal Price API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.rates && data.rates.XAU) {
      // Metal Price API يعطي سعر XAU بالدولار، لكننا نحتاج USD/XAU للتوافق
      // نقوم بحساب المقلوب (1/سعر) للحصول على سعر XAUUSD المعتاد
      const xauPrice = 1 / data.rates.XAU;
      console.log(`تم استلام سعر الذهب من Metal Price API: 1 XAU = ${xauPrice} USD`);
      
      return { 
        success: true, 
        price: xauPrice,
        message: 'تم استلام السعر بنجاح' 
      };
    } else {
      console.error('لم يتم العثور على بيانات سعر صالحة في استجابة API');
      return { 
        success: false, 
        price: null,
        message: 'بيانات السعر غير صالحة في استجابة API' 
      };
    }
  } catch (error) {
    console.error(`خطأ في جلب سعر المعادن من Metal Price API:`, error);
    return { 
      success: false, 
      price: null,
      message: `خطأ: ${error.message || 'خطأ غير معروف'}` 
    };
  }
};
