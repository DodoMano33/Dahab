// تنفيذ مبسط لجلب السعر من Metal Price API

const METAL_PRICE_API_BASE_URL = 'https://api.metalpriceapi.com/v1';

/**
 * تم حذف وظائف جلب الأسعار سابقاً.
 * يجب إضافة مصدر السعر الجديد هنا.
 */
export async function fetchPriceFromMetalPriceApi(symbol: string): Promise<number | null> {
  console.log(`تم حذف وظيفة جلب السعر للرمز ${symbol} وتحتاج إلى تنفيذ المصدر الجديد`);
  return null;
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
