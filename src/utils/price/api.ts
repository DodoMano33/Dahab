
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ALPHA_VANTAGE_API_KEY } from "./config";

export const getAlphaVantageKey = async (): Promise<string> => {
  console.log("استخدام مفتاح Alpha Vantage API المكوّن مسبقاً");
  return ALPHA_VANTAGE_API_KEY;
};

// تخزين حالة حد معدل الاستخدام
let isRateLimited = false;
let rateLimitResetTime = 0;
const RATE_LIMIT_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 ساعة

export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // التحقق مما إذا تم تجاوز حد معدل الاستخدام
    if (isRateLimited) {
      const now = Date.now();
      if (now - rateLimitResetTime < RATE_LIMIT_RESET_DURATION) {
        console.error("تم تجاوز حد معدل API للعملة المشفرة", symbol);
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
        return null;
      } else {
        isRateLimited = false;
      }
    }

    const apiKey = await getAlphaVantageKey();
    if (!apiKey) {
      console.error("مفتاح API غير متوفر");
      return null;
    }

    console.log(`جاري جلب سعر العملة المشفرة ${symbol}...`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      console.error("خطأ في جلب سعر العملة المشفرة:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.Note && data.Note.includes("API call frequency")) {
      console.error("تم تجاوز حد معدل API:", data.Note);
      isRateLimited = true;
      rateLimitResetTime = Date.now();
      toast.error("تم تجاوز حد معدل API (25 طلب/يوم) - يرجى المحاولة غدًا");
      return null;
    }
    
    if (data.Information && data.Information.includes("API rate limit")) {
      console.error("تم تجاوز حد معدل API:", data.Information);
      isRateLimited = true;
      rateLimitResetTime = Date.now();
      toast.error("تم تجاوز حد معدل API (25 طلب/يوم) - يرجى المحاولة غدًا");
      return null;
    }

    const rate = data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"];
    if (!rate) {
      console.error("لم يتم العثور على سعر الصرف في الاستجابة:", data);
      return null;
    }

    console.log(`تم جلب السعر بنجاح للرمز ${symbol}: ${rate}`);
    return parseFloat(rate);
  } catch (error) {
    console.error("خطأ في fetchCryptoPrice:", error);
    return null;
  }
};

export const fetchForexPrice = async (symbol: string): Promise<number | null> => {
  try {
    // التحقق مما إذا تم تجاوز حد معدل الاستخدام
    if (isRateLimited) {
      const now = Date.now();
      if (now - rateLimitResetTime < RATE_LIMIT_RESET_DURATION) {
        console.error("تم تجاوز حد معدل API للفوركس", symbol);
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
        return null;
      } else {
        isRateLimited = false;
      }
    }

    const apiKey = await getAlphaVantageKey();
    if (!apiKey) {
      console.error("مفتاح API غير متوفر");
      return null;
    }

    // تقسيم زوج الفوركس إلى عملتين أساسية ومقابلة
    const from = symbol.substring(0, 3);
    const to = symbol.substring(3, 6);

    console.log(`جاري جلب سعر الفوركس ${from}/${to}...`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      console.error("خطأ في جلب سعر الفوركس:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.Note && data.Note.includes("API call frequency")) {
      console.error("تم تجاوز حد معدل API:", data.Note);
      isRateLimited = true;
      rateLimitResetTime = Date.now();
      toast.error("تم تجاوز حد معدل API (25 طلب/يوم) - يرجى المحاولة غدًا");
      return null;
    }
    
    if (data.Information && data.Information.includes("API rate limit")) {
      console.error("تم تجاوز حد معدل API:", data.Information);
      isRateLimited = true;
      rateLimitResetTime = Date.now();
      toast.error("تم تجاوز حد معدل API (25 طلب/يوم) - يرجى المحاولة غدًا");
      return null;
    }

    const rate = data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"];
    if (!rate) {
      console.error("لم يتم العثور على سعر الصرف في الاستجابة:", data);
      return null;
    }

    console.log(`تم جلب السعر بنجاح للرمز ${symbol}: ${rate}`);
    return parseFloat(rate);
  } catch (error) {
    console.error("خطأ في fetchForexPrice:", error);
    return null;
  }
};

// دالة خاصة للذهب
export const fetchGoldPrice = async (): Promise<number | null> => {
  try {
    // التحقق مما إذا تم تجاوز حد معدل الاستخدام
    if (isRateLimited) {
      const now = Date.now();
      if (now - rateLimitResetTime < RATE_LIMIT_RESET_DURATION) {
        console.error("تم تجاوز حد معدل API للذهب");
        toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
        return null;
      } else {
        isRateLimited = false;
      }
    }

    const apiKey = await getAlphaVantageKey();
    if (!apiKey) {
      console.error("مفتاح API غير متوفر");
      return null;
    }

    console.log("جاري جلب سعر الذهب...");
    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      console.error("خطأ في جلب سعر الذهب:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.Note && data.Note.includes("API call frequency")) {
      console.error("تم تجاوز حد معدل API:", data.Note);
      isRateLimited = true;
      rateLimitResetTime = Date.now();
      toast.error("تم تجاوز حد معدل API (25 طلب/يوم) - يرجى المحاولة غدًا");
      return null;
    }
    
    if (data.Information && data.Information.includes("API rate limit")) {
      console.error("تم تجاوز حد معدل API:", data.Information);
      isRateLimited = true;
      rateLimitResetTime = Date.now();
      toast.error("تم تجاوز حد معدل API (25 طلب/يوم) - يرجى المحاولة غدًا");
      return null;
    }

    const rate = data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"];
    if (!rate) {
      console.error("لم يتم العثور على سعر الذهب في الاستجابة:", data);
      return null;
    }

    console.log(`تم جلب سعر الذهب بنجاح: ${rate}`);
    return parseFloat(rate);
  } catch (error) {
    console.error("خطأ في fetchGoldPrice:", error);
    return null;
  }
};
