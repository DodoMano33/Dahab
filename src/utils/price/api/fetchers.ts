
import { toast } from "sonner";
import { METAL_PRICE_API_URL, FOREX_SYMBOLS, CRYPTO_SYMBOLS, PRECIOUS_METALS } from "../config";
import { checkRateLimit, handleApiResponse, setRateLimited } from "./rateLimit";
import { getMetalPriceApiKey, parseCurrencyPair } from "./helpers";
import { CacheInfo, PriceResponse } from "./types";

// ذاكرة التخزين المؤقت للأسعار
const priceCache: Record<string, CacheInfo> = {};
const CACHE_LIFETIME = 60 * 1000; // 1 دقيقة

/**
 * التحقق من الذاكرة المؤقتة والحصول على السعر المخزن إذا كان صالحًا
 */
export const getCachedPrice = (cacheKey: string): number | null => {
  const cachedData = priceCache[cacheKey];
  if (!cachedData) return null;
  
  const now = Date.now();
  if (now - cachedData.timestamp > CACHE_LIFETIME) return null;
  
  console.log(`استخدام السعر المخزن مؤقتًا للمفتاح ${cacheKey}: ${cachedData.price}`);
  return cachedData.price;
};

/**
 * تخزين السعر في الذاكرة المؤقتة
 */
export const setCachedPrice = (cacheKey: string, price: number): void => {
  priceCache[cacheKey] = {
    price,
    timestamp: Date.now()
  };
};

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

    const apiKey = await getMetalPriceApiKey();
    if (!apiKey) {
      console.error("مفتاح API غير متوفر");
      return { 
        success: false, 
        price: null,
        error: "مفتاح API غير متوفر" 
      };
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

    const rate = data.rates?.[target];
    if (rate === undefined) {
      console.error(`لم يتم العثور على سعر الصرف للرمز ${base}/${target} في الاستجابة:`, data);
      return { 
        success: false, 
        price: null,
        error: "سعر الصرف غير موجود في الاستجابة" 
      };
    }

    // في API Metal Price، العملات الأساسية تحتاج إلى عكس النسبة
    const finalRate = base === target ? 1 : rate;
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
 * جلب سعر العملات الرقمية
 */
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
      const parsedPair = parseCurrencyPair(upperSymbol);
      base = parsedPair.base;
      target = parsedPair.target;
    }
    
    const result = await fetchPriceFromMetalPriceApi(base, target);
    return result.success ? result.price : null;
  } catch (error) {
    console.error(`خطأ في fetchCryptoPrice للرمز ${symbol}:`, error);
    return null;
  }
};

/**
 * جلب سعر الفوركس
 */
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
      const parsedPair = parseCurrencyPair(upperSymbol);
      from = parsedPair.base;
      to = parsedPair.target;
    }
    
    const result = await fetchPriceFromMetalPriceApi(from, to);
    return result.success ? result.price : null;
  } catch (error) {
    console.error(`خطأ في fetchForexPrice للرمز ${symbol}:`, error);
    return null;
  }
};

/**
 * جلب سعر الذهب والمعادن الثمينة
 */
export const fetchPreciousMetalPrice = async (symbol: string): Promise<number | null> => {
  try {
    // تنسيق الرمز
    const upperSymbol = symbol.toUpperCase();
    const metalConfig = PRECIOUS_METALS[upperSymbol as keyof typeof PRECIOUS_METALS];
    
    if (metalConfig) {
      const result = await fetchPriceFromMetalPriceApi(metalConfig.base, metalConfig.target);
      return result.success ? result.price : null;
    } else {
      // افتراضي للذهب
      const result = await fetchPriceFromMetalPriceApi('XAU', 'USD');
      return result.success ? result.price : null;
    }
  } catch (error) {
    console.error(`خطأ في fetchPreciousMetalPrice للرمز ${symbol}:`, error);
    return null;
  }
};
