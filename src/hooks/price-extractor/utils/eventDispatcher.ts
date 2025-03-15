
import { PriceRecord } from '@/components/chart/price-extractor/types';
import { priceUpdater } from '@/utils/price/priceUpdater';

/**
 * إرسال حدث عند العثور على سعر جديد
 */
export const dispatchPriceEvent = (
  price: number,
  source: string
): void => {
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price: price, 
      symbol: 'XAUUSD',
      source: source
    }
  }));
};

/**
 * إنشاء سجل سعر جديد
 */
export const createPriceRecord = (
  price: number,
  source: string
): PriceRecord => {
  return {
    price: price,
    timestamp: new Date(),
    source: source
  };
};

/**
 * محاولة الحصول على سعر الذهب باستخدام Alpha Vantage API
 */
export const fetchExternalGoldPrice = async (): Promise<number | null> => {
  try {
    console.log('Attempting to fetch gold price from Alpha Vantage...');
    const price = await priceUpdater.fetchGoldPrice();
    
    if (price) {
      console.log('Received gold price from Alpha Vantage:', price);
      dispatchPriceEvent(price, 'Alpha Vantage API');
      return price;
    }
    return null;
  } catch (error) {
    console.error('Error fetching gold price from external API:', error);
    return null;
  }
};

/**
 * إدارة وظائف رد الاتصال عند العثور على السعر
 */
export const handlePriceFound = (
  price: number,
  source: string,
  onPriceFound: (price: number, source: string) => void,
  onHistoryUpdate: (newRecord: PriceRecord, prevHistory: PriceRecord[]) => void
): void => {
  // استدعاء وظيفة رد الاتصال للسعر
  onPriceFound(price, source);
  
  // إنشاء سجل جديد
  const newRecord = createPriceRecord(price, source);
  
  // تحديث سجل الأسعار
  onHistoryUpdate(newRecord, []);
  
  // إرسال حدث بالسعر المستخرج
  dispatchPriceEvent(price, source);
};
