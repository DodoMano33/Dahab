
import { toast } from "sonner";
import { getAlphaVantageKey } from "./apiKey";
import { isApiRateLimited, setRateLimited, checkRateLimitInResponse } from "./rateLimit";

export const fetchCryptoPrice = async (symbol: string): Promise<number | null> => {
  try {
    // التحقق مما إذا تم تجاوز حد معدل الاستخدام
    if (isApiRateLimited()) {
      console.error("تم تجاوز حد معدل API للعملة المشفرة", symbol);
      toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا");
      return null;
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
    
    if (checkRateLimitInResponse(data)) {
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
