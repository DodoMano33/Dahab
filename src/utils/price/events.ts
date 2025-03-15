
// خدمة إدارة أحداث السعر

import { PriceUpdate } from './types';

/**
 * نشر حدث تحديث السعر للمستمعين
 */
export function publishPriceUpdate(price: number, symbol: string = 'XAUUSD', isMarketOpen: boolean = true): void {
  const priceUpdate: PriceUpdate = {
    price: price,
    symbol: symbol,
    timestamp: Date.now()
  };
  
  // نشر حدث تحديث السعر عبر TradingView
  window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
    detail: { 
      price: price, 
      symbol: symbol,
      isMarketOpen: isMarketOpen
    }
  }));
  
  // نشر حدث الاستجابة للسعر الحالي
  window.dispatchEvent(new CustomEvent('current-price-response', {
    detail: { 
      price: price,
      symbol: symbol,
      isMarketOpen: isMarketOpen,
      dayLow: price - 3,
      dayHigh: price + 3,
      weekLow: price * 0.98, // أقل بـ 2%
      weekHigh: price * 1.02, // أعلى بـ 2%
      change: 0.35,
      changePercent: 0.012,
      recommendation: "Strong buy"
    }
  }));
  
  // نشر حدث السعر المباشر
  window.dispatchEvent(new CustomEvent('tradingview-direct-price', {
    detail: { 
      price: price, 
      symbol: symbol
    }
  }));
  
  console.log("🔄 تم نشر تحديث السعر:", price);
}

/**
 * طلب السعر الحالي
 */
export function requestCurrentPrice(): void {
  window.dispatchEvent(new Event('request-current-price'));
  window.dispatchEvent(new Event('request-tradingview-price'));
  console.log("📣 تم إرسال طلب للحصول على السعر الحالي");
}
