
import { toast } from "sonner";
import { 
  METAL_PRICE_API_KEY, 
  METAL_PRICE_API_URL, 
  FOREX_SYMBOLS,
  CRYPTO_SYMBOLS,
  PRECIOUS_METALS
} from "./config";

// تخزين حالة حد معدل الاستخدام
let isRateLimited = false;
let rateLimitResetTime = 0;
const RATE_LIMIT_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 ساعة

// الحصول على مفتاح API
export const getMetalPriceApiKey = async (): Promise<string> => {
  console.log("استخدام مفتاح Metal Price API المكوّن مسبقاً");
  return METAL_PRICE_API_KEY;
};

// التحقق من نوع الرمز وإرجاع تصنيفه
export const getSymbolType = (symbol: string): 'forex' | 'crypto' | 'precious_metal' | 'unknown' => {
  const upperSymbol = symbol.toUpperCase();
  
  if (PRECIOUS_METALS[upperSymbol as keyof typeof PRECIOUS_METALS]) {
    return 'precious_metal';
  }
  
  if (FOREX_SYMBOLS[upperSymbol as keyof typeof FOREX_SYMBOLS]) {
    return 'forex';
  }
  
  if (CRYPTO_SYMBOLS[upperSymbol as keyof typeof CRYPTO_SYMBOLS]) {
    return 'crypto';
  }
  
  // محاولة تخمين النوع من تنسيق الرمز إذا لم يكن معرفًا مسبقًا
  if (upperSymbol.includes('USD') || upperSymbol.length === 6) {
    return 'forex';
  }
  
  if (['BTC', 'ETH', 'XRP', 'LTC', 'BCH', 'DOT', 'ADA'].includes(upperSymbol)) {
    return 'crypto';
  }
  
  return 'unknown';
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
        console.error(`تم تجاوز حد معدل API للرمز ${base}/${target}`);
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

    console.log(`جاري جلب سعر ${base}/${target} من Metal Price API...`);
    const url = `${METAL_PRICE_API_URL}/latest?api_key=${apiKey}&base=${base}&currencies=${target}`;
    
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
        isRateLimited = true;
        rateLimitResetTime = Date.now();
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
      }
      return null;
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error(`استجابة خاطئة من API للرمز ${base}/${target}:`, data);
      if (data.error && data.error.includes("rate limit")) {
        isRateLimited = true;
        rateLimitResetTime = Date.now();
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
      }
      return null;
    }

    const rate = data.rates?.[target];
    if (rate === undefined) {
      console.error(`لم يتم العثور على سعر الصرف للرمز ${base}/${target} في الاستجابة:`, data);
      return null;
    }

    // في API Metal Price، العملات الأساسية تحتاج إلى عكس النسبة
    const finalRate = base === target ? 1 : rate;
    console.log(`تم جلب السعر بنجاح للرمز ${base}/${target}: ${finalRate}`);
    return finalRate;
  } catch (error) {
    console.error(`خطأ في fetchPriceFromMetalPriceApi للرمز ${base}/${target}:`, error);
    return null;
  }
};

// جلب سعر العملات الرقمية
export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const cryptoConfig = CRYPTO_SYMBOLS[upperSymbol as keyof typeof CRYPTO_SYMBOLS];
    
    let base: string;
    let target: string;
    
    if (cryptoConfig) {
      base = cryptoConfig.base;
      target = cryptoConfig.target;
    } else {
      // استخدام الرمز كما هو مع الهدف الافتراضي USD
      base = upperSymbol.replace('USD', ''); // إزالة USD من الرمز إذا وجد
      target = 'USD';
    }
    
    return await fetchPriceFromMetalPriceApi(base, target);
  } catch (error) {
    console.error(`خطأ في fetchCryptoPrice للرمز ${symbol}:`, error);
    return null;
  }
};

// جلب سعر الفوركس
export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const forexConfig = FOREX_SYMBOLS[upperSymbol as keyof typeof FOREX_SYMBOLS];
    
    let from: string;
    let to: string;
    
    if (forexConfig) {
      from = forexConfig.from;
      to = forexConfig.to;
    } else {
      // تقسيم زوج الفوركس إلى عملتين أساسية ومقابلة
      if (upperSymbol.length >= 6) {
        from = upperSymbol.substring(0, 3);
        to = upperSymbol.substring(3, 6);
      } else {
        // إذا كان الرمز غير صالح، نستخدم USD كافتراضي
        from = upperSymbol;
        to = 'USD';
      }
    }
    
    return await fetchPriceFromMetalPriceApi(from, to);
  } catch (error) {
    console.error(`خطأ في fetchForexPrice للرمز ${symbol}:`, error);
    return null;
  }
};

// جلب سعر الذهب والمعادن الثمينة
export const fetchPreciousMetalPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const metalConfig = PRECIOUS_METALS[upperSymbol as keyof typeof PRECIOUS_METALS];
    
    if (metalConfig) {
      return await fetchPriceFromMetalPriceApi(metalConfig.base, metalConfig.target);
    } else {
      // افتراضي للذهب
      return await fetchPriceFromMetalPriceApi('XAU', 'USD');
    }
  } catch (error) {
    console.error(`خطأ في fetchPreciousMetalPrice للرمز ${symbol}:`, error);
    return null;
  }
};

// واجهة موحدة لجلب السعر حسب نوع الرمز
export const fetchPrice = async (symbol: string): Promise<number | null> => {
  if (!symbol) {
    console.error("تم تمرير رمز فارغ إلى fetchPrice");
    return null;
  }
  
  try {
    const symbolType = getSymbolType(symbol);
    
    switch (symbolType) {
      case 'precious_metal':
        return await fetchPreciousMetalPrice(symbol);
      case 'forex':
        return await fetchForexPrice(symbol);
      case 'crypto':
        return await fetchCryptoPrice(symbol);
      default:
        // محاولة فوركس كافتراضي
        const forexPrice = await fetchForexPrice(symbol);
        if (forexPrice !== null) return forexPrice;
        
        // محاولة عملة رقمية كخطة بديلة
        return await fetchCryptoPrice(symbol);
    }
  } catch (error) {
    console.error(`خطأ في fetchPrice للرمز ${symbol}:`, error);
    return null;
  }
};
