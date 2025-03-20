
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
      return { 
        success: true, 
        price: cachedPrice,
        timestamp: Date.now()
      };
    }

    const apiKey = getMetalPriceApiKey();
    if (!apiKey) {
      console.error("مفتاح API غير متوفر");
      return { 
        success: false, 
        price: null,
        error: "مفتاح API غير متوفر" 
      };
    }

    console.log(`جاري جلب سعر ${base}/${target} من Metal Price API...`);
    
    // تحديد القاعدة المناسبة للطلب
    // إذا كانت base = XAU مثلا، نستخدم الدولار كأساس للطلب ونأخذ XAU كعملة
    let apiBase = 'USD';
    let apiCurrency = base.toLowerCase();
    
    // التعامل مع المعادن والعملات الخاصة
    if (base === 'XAU') apiCurrency = 'gold';
    if (base === 'XAG') apiCurrency = 'silver';
    
    const url = `${METAL_PRICE_API_URL}/latest?api_key=${apiKey}&base=${apiBase}&currencies=${apiCurrency}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

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

    const data = await response.json();
    
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
