
import { toast } from "sonner";
import { METAL_PRICE_API_KEY, METAL_PRICE_API_URL } from "./config";

// تخزين حالة حد معدل الاستخدام
let isRateLimited = false;
let rateLimitResetTime = 0;
const RATE_LIMIT_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 ساعة

// الحصول على مفتاح API
export const getMetalPriceApiKey = async (): Promise<string> => {
  console.log("استخدام مفتاح Metal Price API المكوّن مسبقاً");
  return METAL_PRICE_API_KEY;
};

// دالة مساعدة لجلب السعر من Metal Price API
const fetchPriceFromMetalPriceApi = async (
  base: string, 
  target: string = 'USD'
): Promise<number | null> => {
  try {
    // التحقق مما إذا تم تجاوز حد معدل الاستخدام
    if (isRateLimited) {
      const now = Date.now();
      if (now - rateLimitResetTime < RATE_LIMIT_RESET_DURATION) {
        console.error("تم تجاوز حد معدل API", base);
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
        return null;
      } else {
        isRateLimited = false;
      }
    }

    const apiKey = await getMetalPriceApiKey();
    if (!apiKey) {
      console.error("مفتاح API غير متوفر");
      return null;
    }

    console.log(`جاري جلب سعر ${base}/${target}...`);
    const url = `${METAL_PRICE_API_URL}/latest?api_key=${apiKey}&base=${base}&currencies=${target}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      console.error("خطأ في جلب السعر:", response.statusText);
      // التحقق من حد معدل الاستخدام
      if (response.status === 429) {
        isRateLimited = true;
        rateLimitResetTime = Date.now();
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
      }
      return null;
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error("استجابة خاطئة من API:", data);
      if (data.error && data.error.includes("rate limit")) {
        isRateLimited = true;
        rateLimitResetTime = Date.now();
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
      }
      return null;
    }

    const rate = data.rates?.[target];
    if (rate === undefined) {
      console.error("لم يتم العثور على سعر الصرف في الاستجابة:", data);
      return null;
    }

    // في API Metal Price، العملات الأساسية تحتاج إلى عكس النسبة
    const finalRate = base === target ? 1 : rate;
    console.log(`تم جلب السعر بنجاح للرمز ${base}/${target}: ${finalRate}`);
    return finalRate;
  } catch (error) {
    console.error("خطأ في fetchPriceFromMetalPriceApi:", error);
    return null;
  }
};

export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const formattedSymbol = symbol.toUpperCase();
    return await fetchPriceFromMetalPriceApi(formattedSymbol, 'USD');
  } catch (error) {
    console.error("خطأ في fetchCryptoPrice:", error);
    return null;
  }
};

export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تقسيم زوج الفوركس إلى عملتين أساسية ومقابلة
    const from = symbol.substring(0, 3);
    const to = symbol.substring(3, 6);
    return await fetchPriceFromMetalPriceApi(from, to);
  } catch (error) {
    console.error("خطأ في fetchForexPrice:", error);
    return null;
  }
};

export const fetchGoldPrice = async (): Promise<number | null> => {
  try {
    return await fetchPriceFromMetalPriceApi('XAU', 'USD');
  } catch (error) {
    console.error("خطأ في fetchGoldPrice:", error);
    return null;
  }
};
