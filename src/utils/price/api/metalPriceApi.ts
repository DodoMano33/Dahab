
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
  symbol: string
): Promise<PriceResponse> => {
  try {
    // التحقق من حد معدل الاستخدام
    if (checkRateLimit()) {
      console.error(`تم تجاوز حد معدل API للرمز ${symbol}`);
      return {
        success: false,
        price: null,
        error: `تم تجاوز حد معدل API للرمز ${symbol}`
      };
    }

    // استخدام المفتاح الثابت المحدد
    const apiKey = FIXED_API_KEY;
    
    console.log(`جاري جلب سعر ${symbol} من Metal Price API...`);
    
    // تحويل الرموز إلى الصيغة المطلوبة
    let base = 'USD';
    let target = 'XAU';
    
    // تعديل نوع الطلب بناءً على الرمز
    if (symbol.toUpperCase() === 'XAUUSD' || symbol.toUpperCase() === 'GOLD') {
      base = 'USD';
      target = 'XAU';
    } else if (symbol.toUpperCase() === 'XAGUSD' || symbol.toUpperCase() === 'SILVER') {
      base = 'USD';
      target = 'XAG';
    } else if (symbol.length === 6) {
      // للأزواج مثل EURUSD
      base = 'USD';
      target = symbol.substring(0, 3);
    }
    
    console.log(`استخدام ${base}/${target} في طلب API`);

    // بناء URL الطلب 
    const url = `${METAL_PRICE_API_URL}/latest?api_key=${apiKey}&base=${base}&currencies=${target}`;
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
      console.error(`خطأ في جلب السعر للرمز ${symbol}: ${response.status} ${response.statusText}`);
      
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
    console.log(`استجابة API لـ ${symbol}:`, data);
    
    if (!data.success) {
      console.error(`استجابة خاطئة من API للرمز ${symbol}:`, data);
      
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
    const rate = data.rates?.[target];
    if (rate === undefined) {
      console.error(`لم يتم العثور على سعر الصرف للرمز ${symbol} في الاستجابة:`, data);
      return { 
        success: false, 
        price: null,
        error: "سعر الصرف غير موجود في الاستجابة" 
      };
    }

    // في Metal Price API: عندما نستخدم USD كقاعدة، القيمة المعادة هي USD/XAU - نحن نريد XAU/USD، لذلك نأخذ المقلوب
    const finalRate = 1 / rate;
    console.log(`تم جلب السعر بنجاح للرمز ${symbol}: ${finalRate}`);
    
    return { 
      success: true, 
      price: finalRate,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`خطأ في fetchPriceFromMetalPriceApi للرمز ${symbol}:`, error);
    return { 
      success: false, 
      price: null,
      error: `خطأ: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};
