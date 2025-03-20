
// تنفيذ وظيفة جلب الأسعار من Metal Price API

const METAL_PRICE_API_KEY = '42ed2fe2e7d1d8f688ddeb027219c766';
const METAL_PRICE_API_BASE_URL = 'https://api.metalpriceapi.com/v1';

/**
 * جلب سعر المعدن من Metal Price API
 */
export async function fetchPriceFromMetalPriceApi(symbol: string): Promise<number | null> {
  try {
    console.log(`جاري جلب السعر للرمز ${symbol} من Metal Price API...`);
    
    // تحويل الرمز إلى الصيغة المناسبة لـ Metal Price API
    const apiCurrency = getApiCurrency(symbol);
    const apiBase = 'USD'; // دائمًا نستخدم USD كعملة أساسية
    
    // بناء URL الطلب
    const url = `${METAL_PRICE_API_BASE_URL}/latest?api_key=${METAL_PRICE_API_KEY}&base=${apiBase}&currencies=${apiCurrency}`;
    
    // إرسال الطلب إلى API
    const response = await fetch(url);
    
    // التحقق من حالة الاستجابة
    if (!response.ok) {
      throw new Error(`خطأ في جلب السعر: ${response.status} ${response.statusText}`);
    }
    
    // تحليل بيانات الاستجابة
    const data = await response.json();
    console.log(`استجابة API للرمز ${symbol}:`, data);
    
    if (!data.success) {
      throw new Error(`استجابة غير ناجحة من API: ${JSON.stringify(data)}`);
    }
    
    // استخراج سعر الصرف من الاستجابة
    const rate = data.rates[apiCurrency];
    
    if (rate === undefined) {
      throw new Error(`لم يتم العثور على سعر للرمز ${symbol} في الاستجابة`);
    }
    
    // تحويل السعر - في Metal Price API عندما نستخدم USD كعملة أساسية والعملة المطلوبة هي XAU،
    // فإن القيمة المعادة هي كم دولار يساوي 1 وحدة من XAU، لذلك نحتاج إلى أخذ مقلوب القيمة
    // للحصول على سعر XAU/USD (أي كم وحدة من XAU تساوي 1 دولار)
    const finalPrice = 1 / rate;
    
    console.log(`تم جلب السعر بنجاح للرمز ${symbol}: ${finalPrice}`);
    return finalPrice;
    
  } catch (error) {
    console.error(`خطأ في جلب السعر للرمز ${symbol} من Metal Price API:`, error);
    return null;
  }
}

/**
 * تحويل رمز العملة إلى صيغة مناسبة لـ Metal Price API
 */
function getApiCurrency(symbol: string): string {
  const upperSymbol = symbol.toUpperCase();
  
  // التعامل مع الرموز الخاصة
  if (upperSymbol === 'XAUUSD' || upperSymbol === 'GOLD' || upperSymbol === 'XAU') {
    return 'XAU';
  }
  
  if (upperSymbol === 'XAGUSD' || upperSymbol === 'SILVER' || upperSymbol === 'XAG') {
    return 'XAG';
  }
  
  if (upperSymbol === 'BTCUSD' || upperSymbol === 'BTC') {
    return 'BTC';
  }
  
  if (upperSymbol === 'ETHUSD' || upperSymbol === 'ETH') {
    return 'ETH';
  }
  
  // للرموز الأخرى، استخدم الحروف الأولى الثلاثة
  if (upperSymbol.length >= 6) {
    return upperSymbol.substring(0, 3);
  }
  
  // للرموز الأخرى، استخدم الرمز كما هو
  return upperSymbol;
}
