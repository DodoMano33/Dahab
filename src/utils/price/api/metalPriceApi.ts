
import { PriceResponse } from "./types";
import { getMetalPriceApiKey, mapSymbolToMetalPriceSymbol } from "./helpers";
import { checkRateLimit, handleApiResponse, setRateLimited } from "./rateLimit";

// عنوان API الأساسي
const METAL_PRICE_API_URL = 'https://api.metalpriceapi.com/v1';

// المفتاح الثابت المحدد
const FIXED_API_KEY = '42ed2fe2e7d1d8f688ddeb027219c766';

/**
 * جلب السعر من Metal Price API مع معالجة الأخطاء والتخزين المؤقت
 */
export const fetchPriceFromMetalPriceApi = async (
  base: string, 
  target: string = 'USD'
): Promise<PriceResponse> => {
  try {
    // التحقق من حد معدل الاستخدام
    if (checkRateLimit()) {
      console.error(`تم تجاوز حد معدل API للرمز ${base}/${target}`);
      return {
        success: false,
        price: null,
        error: `تم تجاوز حد معدل API للرمز ${base}/${target}`
      };
    }

    // استخدام المفتاح الثابت المحدد
    const apiKey = FIXED_API_KEY;
    
    console.log(`جاري جلب سعر ${base}/${target} من Metal Price API...`);
    
    // تصحيح الطريقة: استخدام المعدن كعملة وليس قاعدة في واجهة Metal Price API
    // تحويل الرموز إلى الصيغة المطلوبة
    const apiBase = 'USD';  // دائمًا نستخدم USD كقاعدة في Metal Price API
    const apiCurrency = mapSymbolToMetalPriceApi(base);
    
    console.log(`استخدام العملة ${apiCurrency} كعملة في طلب API`);

    // بناء URL الطلب - نستخدم المعدن كعملة وليس كقاعدة في Metal Price API
    const url = `${METAL_PRICE_API_URL}/latest?api_key=${apiKey}&base=${apiBase}&currencies=${apiCurrency}`;
    console.log(`URL الطلب (بدون مفتاح): ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    // إرسال الطلب إلى API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Metal-Price-API-Client/1.0'
      }
    });

    // التحقق من حالة الاستجابة
    if (!response.ok) {
      console.error(`خطأ في جلب السعر للرمز ${base}/${target}: ${response.status} ${response.statusText}`);
      
      // التحقق من حد معدل الاستخدام
      if (response.status === 429) {
        setRateLimited(true);
      }
      
      return { 
        success: false, 
        price: null,
        error: `حالة الاستجابة: ${response.status} ${response.statusText}`
      };
    }

    // تحليل بيانات الاستجابة
    const data = await response.json();
    console.log(`استجابة API لـ ${base}/${target}:`, data);
    
    if (!data.success) {
      console.error(`استجابة خاطئة من API للرمز ${base}/${target}:`, data);
      
      // التحقق من رسالة خطأ حد معدل الاستخدام
      if (handleApiResponse(response.status, data)) {
        return { 
          success: false, 
          price: null,
          error: "تم تجاوز حد معدل الاستخدام" 
        };
      }
      
      return { 
        success: false, 
        price: null,
        error: data.error || "خطأ غير معروف من API" 
      };
    }

    // استخراج سعر الصرف من الاستجابة
    const rate = data.rates?.[apiCurrency];
    if (rate === undefined) {
      console.error(`لم يتم العثور على سعر الصرف للرمز ${base}/${target} في الاستجابة:`, data);
      return { 
        success: false, 
        price: null,
        error: "سعر الصرف غير موجود في الاستجابة" 
      };
    }

    // في Metal Price API: عندما نستخدم USD كقاعدة، القيمة المعادة هي USD/XAU - نحن نريد XAU/USD، لذلك نأخذ المقلوب
    const finalRate = 1 / rate;
    console.log(`تم جلب السعر بنجاح للرمز ${base}/${target}: ${finalRate}`);
    
    return { 
      success: true, 
      price: finalRate,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`خطأ في fetchPriceFromMetalPriceApi للرمز ${base}/${target}:`, error);
    return { 
      success: false, 
      price: null,
      error: `خطأ: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

/**
 * تحويل رمز العملة الأساسي إلى الصيغة المناسبة لـ Metal Price API
 */
function mapSymbolToMetalPriceApi(base: string): string {
  // تحويل إلى أحرف كبيرة
  const lowerBase = base.toLowerCase();
  
  // تعريف التحويلات الخاصة
  const specialMappings: Record<string, string> = {
    'xau': 'XAU',
    'xag': 'XAG',
    'gold': 'XAU',
    'silver': 'XAG',
    'btc': 'BTC',
    'eth': 'ETH'
  };
  
  // إذا كان الرمز في التحويلات الخاصة، نستخدمه
  if (specialMappings[lowerBase]) {
    return specialMappings[lowerBase];
  }
  
  // وإلا، نعيد الرمز كما هو ولكن بأحرف كبيرة
  return lowerBase.toUpperCase();
}
