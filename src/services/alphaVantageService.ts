
/**
 * خدمة للتفاعل مع Alpha Vantage API للحصول على أسعار الذهب
 */
let API_KEY = '9Q0LHPLPMFGOFSFV';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface GoldPriceResponse {
  price: number;
  timestamp: string;
}

/**
 * الحصول على سعر الذهب الحالي من Alpha Vantage API
 */
export async function fetchGoldPrice(): Promise<GoldPriceResponse> {
  try {
    console.log('جاري طلب سعر الذهب من Alpha Vantage...');
    const url = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`فشل طلب Alpha Vantage: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('استجابة Alpha Vantage:', data);
    
    if (data['Realtime Currency Exchange Rate']) {
      const exchangeRate = data['Realtime Currency Exchange Rate'];
      const price = parseFloat(exchangeRate['5. Exchange Rate']);
      const timestamp = exchangeRate['6. Last Refreshed'];
      
      if (!isNaN(price)) {
        console.log(`تم الحصول على سعر الذهب: ${price} في ${timestamp}`);
        
        // إرسال حدث لتحديث السعر في جميع أنحاء التطبيق
        window.dispatchEvent(
          new CustomEvent('alpha-vantage-price-update', {
            detail: { price, timestamp }
          })
        );
        
        return { price, timestamp };
      }
    }
    
    throw new Error('تنسيق بيانات غير صالح من Alpha Vantage');
  } catch (error) {
    console.error('خطأ في جلب سعر الذهب:', error);
    throw error;
  }
}

/**
 * تخزين API Key في localStorage
 */
export function saveAlphaVantageApiKey(apiKey: string): void {
  localStorage.setItem('alphaVantageApiKey', apiKey);
}

/**
 * استرداد API Key من localStorage
 */
export function getAlphaVantageApiKey(): string | null {
  return localStorage.getItem('alphaVantageApiKey');
}

/**
 * تحديث API Key المستخدم
 */
export function updateApiKey(newApiKey: string): void {
  API_KEY = newApiKey;
  saveAlphaVantageApiKey(newApiKey);
}
