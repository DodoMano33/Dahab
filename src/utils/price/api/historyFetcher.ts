
import { getMetalPriceApiKey } from "./helpers";
import { rateLimit } from "./rateLimit";
import { getStoredPrice } from "./helpers";

/**
 * جلب بيانات الأسعار التاريخية للذهب
 * @param symbol رمز الأداة المالية
 * @param timeframe الإطار الزمني
 * @returns مصفوفة من أسعار الإغلاق التاريخية
 */
export const fetchHistoricalPrices = async (symbol: string, timeframe: string): Promise<number[]> => {
  try {
    console.log(`جلب البيانات التاريخية للرمز ${symbol} على الإطار الزمني ${timeframe}`);
    
    // التحقق من حالة حد معدل الاستخدام
    if (rateLimit.isRateLimited()) {
      console.log('تم تجاوز حد معدل الاستخدام. استخدام بيانات محاكاة.');
      return generateSimulatedPrices(await getStoredPrice('XAUUSD') || 2000);
    }
    
    // تحديد عدد الأيام بناءً على الإطار الزمني
    const days = getTimeframeDays(timeframe);
    
    // تحضير معلمات الطلب
    const apiKey = getMetalPriceApiKey();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // بناء عنوان URL للطلب
    const url = `https://api.metalpriceapi.com/v1/timeframe?api_key=${apiKey}&start_date=${startDateStr}&end_date=${endDateStr}&base=USD&currencies=XAU`;
    
    console.log(`جلب البيانات التاريخية من Metal Price API: ${url}`);
    
    // إرسال طلب API
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`فشل جلب البيانات التاريخية: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("بيانات تاريخية مستلمة:", data);
    
    if (data.success && data.rates) {
      // استخراج أسعار XAU وتحويلها إلى أسعار XAUUSD
      const prices: number[] = [];
      
      // ترتيب التواريخ تصاعدياً
      const dates = Object.keys(data.rates).sort();
      
      for (const date of dates) {
        if (data.rates[date] && data.rates[date].XAU) {
          // تحويل سعر XAU إلى XAUUSD (1/XAU)
          const xauusdPrice = 1 / data.rates[date].XAU;
          prices.push(xauusdPrice);
        }
      }
      
      console.log(`تم استخراج ${prices.length} سعر تاريخي`);
      
      if (prices.length > 0) {
        return prices;
      }
    }
    
    console.log("لم يتم العثور على بيانات تاريخية صالحة، استخدام بيانات محاكاة");
    return generateSimulatedPrices(await getStoredPrice('XAUUSD') || 2000);
    
  } catch (error) {
    console.error("خطأ في جلب البيانات التاريخية:", error);
    console.log("الرجوع إلى بيانات محاكاة بسبب خطأ");
    return generateSimulatedPrices(await getStoredPrice('XAUUSD') || 2000);
  }
};

/**
 * تنسيق التاريخ بصيغة YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * تحديد عدد الأيام التاريخية بناءً على الإطار الزمني
 */
const getTimeframeDays = (timeframe: string): number => {
  switch (timeframe.toLowerCase()) {
    case '1m':
    case '5m':
    case '15m':
      return 7; // أسبوع واحد
    case '30m':
    case '1h':
    case '4h':
      return 14; // أسبوعان
    case '1d':
      return 60; // شهران
    case '1w':
      return 180; // ستة أشهر
    case '1mo':
      return 365; // سنة
    default:
      return 30; // القيمة الافتراضية: شهر
  }
};

/**
 * توليد بيانات أسعار محاكاة في حالة فشل جلب البيانات الحقيقية
 */
const generateSimulatedPrices = (currentPrice: number): number[] => {
  console.log(`توليد بيانات محاكاة حول السعر الحالي: ${currentPrice}`);
  const prices: number[] = [];
  const volatility = 0.01; // نسبة التقلب
  
  // توليد 200 سعر تاريخي للمحاكاة
  for (let i = 0; i < 200; i++) {
    if (i === 0) {
      prices.push(currentPrice * (1 - volatility));
    } else {
      const change = (Math.random() - 0.5) * volatility * 2;
      prices.push(prices[i - 1] * (1 + change));
    }
  }
  
  // إضافة السعر الحالي في النهاية
  prices.push(currentPrice);
  
  return prices;
};
