
import { PriceResponse } from "./types";
import { getMetalPriceApiKey } from "./helpers";
import { checkRateLimit, handleApiResponse, setRateLimited } from "./rateLimit";
import { getCachedPrice, setCachedPrice } from "./cache";

// Base URL for Metal Price API
const METAL_PRICE_API_URL = 'https://api.metalpriceapi.com/v1';

/**
 * دالة مساعدة لجلب السعر من Metal Price API
 */
export const fetchPriceFromMetalPriceApi = async (
  base: string, 
  target: string = 'USD'
): Promise<PriceResponse> => {
  try {
    // التحقق مما إذا تم تجاوز حد معدل الاستخدام
    if (checkRateLimit()) {
      console.error(`تم تجاوز حد معدل API للرمز ${base}/${target}`);
      return {
        success: false,
        price: null,
        error: `تم تجاوز حد معدل API للرمز ${base}/${target}`
      };
    }

    // بناء مفتاح التخزين المؤقت
    const cacheKey = `${base}_${target}`;
    
    // التحقق من الذاكرة المؤقتة أولاً
    const cachedPrice = getCachedPrice(cacheKey);
    if (cachedPrice !== null) {
      console.log(`استخدام السعر المخزن مؤقتًا للرمز ${base}/${target}: ${cachedPrice}`);
      return { 
        success: true, 
        price: cachedPrice,
        timestamp: Date.now()
      };
    }

    // الحصول على مفتاح API - استخدام المفتاح المقدم مباشرة إذا لم يكن هناك مفتاح في التكوين
    const apiKey = getMetalPriceApiKey() || '42ed2fe2e7d1d8f688ddeb027219c766';
    if (!apiKey) {
      console.error("مفتاح API غير متوفر");
      return { 
        success: false, 
        price: null,
        error: "مفتاح API غير متوفر" 
      };
    }

    console.log(`جاري جلب سعر ${base}/${target} من Metal Price API...`);
    
    // تحويل رموز المعادن إلى الصيغة المطلوبة
    let apiBase = 'USD';  // دائمًا نستخدم USD كأساس في Metal Price API
    let apiCurrency = mapBaseToCurrency(base);
    
    console.log(`استخدام العملة ${apiCurrency} كعملة في طلب API`);

    // بناء URL الطلب
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
      
      // التحقق من رسالة الخطأ المتعلقة بحد معدل الاستخدام
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

    // في API Metal Price، عندما نستخدم USD كأساس نحتاج إلى قلب النسبة
    const finalRate = 1 / rate;
    console.log(`تم جلب السعر بنجاح للرمز ${base}/${target}: ${finalRate}`);
    
    // تخزين السعر في الذاكرة المؤقتة
    setCachedPrice(cacheKey, finalRate);
    
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
 * تحويل رمز العملة الأساسية إلى صيغة مناسبة لـ Metal Price API
 */
function mapBaseToCurrency(base: string): string {
  // تحويل الرمز إلى حروف صغيرة
  const lowerBase = base.toLowerCase();
  
  // تعيين الرموز الخاصة
  const specialMappings: Record<string, string> = {
    'xau': 'gold',
    'xag': 'silver',
    'gold': 'gold',
    'silver': 'silver',
    'btc': 'btc',
    'eth': 'eth'
  };
  
  // إذا كان الرمز موجودًا في القائمة الخاصة، استخدمه
  if (specialMappings[lowerBase]) {
    return specialMappings[lowerBase];
  }
  
  // بخلاف ذلك، أعد الرمز كما هو
  return lowerBase;
}
