
// تنفيذ مبسط لجلب السعر من Metal Price API

const METAL_PRICE_API_BASE_URL = 'https://api.metalpriceapi.com/v1';

/**
 * جلب سعر المعدن من Metal Price API
 */
export async function fetchPriceFromMetalPriceApi(symbol: string): Promise<number | null> {
  try {
    const apiKey = Deno.env.get('METAL_PRICE_API_KEY') || '42ed2fe2e7d1d8f688ddeb027219c766';
    
    if (!apiKey) {
      console.error('مفتاح Metal Price API غير متوفر');
      return null;
    }
    
    // للاختبار: دعم الرموز المختلفة
    let useSymbol = symbol.toLowerCase();
    
    // تعيينات خاصة
    if (symbol.toUpperCase() === 'XAUUSD') useSymbol = 'gold';
    if (symbol.toUpperCase() === 'XAGUSD') useSymbol = 'silver';
    if (symbol.toUpperCase() === 'GOLD') useSymbol = 'gold';
    
    const url = `${METAL_PRICE_API_BASE_URL}/latest?api_key=${apiKey}&base=USD&currencies=${useSymbol}`;
    
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
    
    if (data && data.rates && data.rates[useSymbol]) {
      // قلب السعر لأن الأساس هو USD
      const price = 1 / data.rates[useSymbol];
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
