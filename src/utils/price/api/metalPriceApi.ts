
import { PriceResponse } from "./types";
import { getMetalPriceApiKey, mapSymbolToMetalPriceSymbol } from "./helpers";
import { checkRateLimit, handleApiResponse, setRateLimited } from "./rateLimit";

// Base URL for Metal Price API
const METAL_PRICE_API_URL = 'https://api.metalpriceapi.com/v1';

// Fixed API key to always use
const FIXED_API_KEY = '42ed2fe2e7d1d8f688ddeb027219c766';

/**
 * Fetch price from Metal Price API with consistent error handling and caching
 */
export const fetchPriceFromMetalPriceApi = async (
  base: string, 
  target: string = 'USD'
): Promise<PriceResponse> => {
  try {
    // Check for rate limiting
    if (checkRateLimit()) {
      console.error(`تم تجاوز حد معدل API للرمز ${base}/${target}`);
      return {
        success: false,
        price: null,
        error: `تم تجاوز حد معدل API للرمز ${base}/${target}`
      };
    }

    // Always use the fixed API key
    const apiKey = FIXED_API_KEY;
    
    console.log(`جاري جلب سعر ${base}/${target} من Metal Price API...`);
    
    // تصحيح الطريقة: استخدام المعدن كعملة وليس قاعدة في واجهة Metal Price API
    // Map symbols to required format
    const apiBase = 'USD';  // Always use USD as base in Metal Price API
    const apiCurrency = mapSymbolToMetalPriceApi(base);
    
    console.log(`استخدام العملة ${apiCurrency} كعملة في طلب API`);

    // Build request URL - نستخدم الذهب كعملة وليس كقاعدة في Metal Price API
    const url = `${METAL_PRICE_API_URL}/latest?api_key=${apiKey}&base=${apiBase}&currencies=${apiCurrency}`;
    console.log(`URL الطلب (بدون مفتاح): ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    // Send request to API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Metal-Price-API-Client/1.0'
      }
    });

    // Check response status
    if (!response.ok) {
      console.error(`خطأ في جلب السعر للرمز ${base}/${target}: ${response.status} ${response.statusText}`);
      
      // Check for rate limiting
      if (response.status === 429) {
        setRateLimited(true);
      }
      
      return { 
        success: false, 
        price: null,
        error: `حالة الاستجابة: ${response.status} ${response.statusText}`
      };
    }

    // Parse response data
    const data = await response.json();
    console.log(`استجابة API لـ ${base}/${target}:`, data);
    
    if (!data.success) {
      console.error(`استجابة خاطئة من API للرمز ${base}/${target}:`, data);
      
      // Check for rate limit related error message
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

    // Extract exchange rate from the response
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
 * Map base currency symbol to appropriate format for Metal Price API
 */
function mapSymbolToMetalPriceApi(base: string): string {
  // تحويل إلى أحرف صغيرة
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
