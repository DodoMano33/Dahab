
// تنفيذ مبسط لجلب السعر من Metal Price API

const METAL_PRICE_API_BASE_URL = 'https://api.metalpriceapi.com/v1';

/**
 * جلب سعر المعدن من Metal Price API
 */
export async function fetchPriceFromMetalPriceApi(symbol: string): Promise<number | null> {
  try {
    // استخدام المفتاح الثابت المحدد مسبقًا
    const apiKey = '42ed2fe2e7d1d8f688ddeb027219c766';
    
    // تحويل الرمز إلى صيغة مناسبة لـ API
    let apiCurrency = getApiCurrency(symbol);
    const apiBase = 'USD'; // دائما نستخدم USD كأساس
    
    console.log(`استخدام العملة ${apiCurrency} مع القاعدة ${apiBase} للرمز ${symbol}`);
    
    const url = `${METAL_PRICE_API_BASE_URL}/latest?api_key=${apiKey}&base=${apiBase}&currencies=${apiCurrency}`;
    
    console.log(`جاري الاتصال بـ Metal Price API: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Metal-Price-API-Client/1.0'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`خطأ في استجابة Metal Price API: ${response.status}`, errorText);
      
      if (response.status === 429) {
        console.error('تم تجاوز حد معدل استخدام Metal Price API');
      }
      
      return null;
    }
    
    const data = await response.json();
    console.log(`استجابة API:`, data);
    
    if (data && data.success && data.rates && data.rates[apiCurrency]) {
      // قلب السعر لأن الأساس هو USD
      const price = 1 / data.rates[apiCurrency];
      console.log(`تم جلب السعر للرمز ${symbol}: ${price}`);
      return price;
    }
    
    console.error(`لم يتم العثور على سعر للرمز ${symbol} في استجابة API:`, data);
    return null;
  } catch (error) {
    console.error(`خطأ في جلب السعر من Metal Price API للرمز ${symbol}:`, error);
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
