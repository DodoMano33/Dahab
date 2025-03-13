
import { PriceRecord } from '@/components/chart/price-extractor/types';

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
