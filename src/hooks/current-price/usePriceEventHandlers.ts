
import { useState, useEffect, useCallback } from 'react';
import { PriceUpdateEvent, CurrentPriceResponseEvent, MarketData } from './types';
import { priceUpdater } from '@/utils/price/priceUpdater';

export const usePriceEventHandlers = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(() => {
    // استخدام آخر سعر محفوظ كقيمة مبدئية
    return priceUpdater.getLastGoldPrice();
  });
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [marketData, setMarketData] = useState<MarketData | undefined>(undefined);

  const handlePriceUpdate = useCallback((event: PriceUpdateEvent) => {
    if (event.detail && event.detail.price) {
      console.log('useCurrentPrice: Price updated to', event.detail.price);
      setCurrentPrice(event.detail.price);
      setPriceUpdateCount(prev => prev + 1);

      // تحديث عنصر عرض السعر مباشرة إن وجد
      const priceDisplayElement = document.getElementById('tradingview-price-display');
      if (priceDisplayElement) {
        priceDisplayElement.textContent = `السعر الحالي: ${event.detail.price.toFixed(2)}`;
      }
      
      // تحديث عنصر السعر في الإحصائيات إن وجد
      const statsDisplayElement = document.getElementById('stats-price-display');
      if (statsDisplayElement) {
        statsDisplayElement.textContent = event.detail.price.toFixed(2);
      }
    }
  }, []);

  const handleCurrentPriceResponse = useCallback((event: CurrentPriceResponseEvent) => {
    if (event.detail && event.detail.price) {
      console.log('useCurrentPrice: Received current price', event.detail.price);
      setCurrentPrice(event.detail.price);
      setPriceUpdateCount(prev => prev + 1);
      
      // تحديث بيانات السوق
      const newMarketData: MarketData = {
        symbol: event.detail.symbol,
        dayLow: event.detail.dayLow,
        dayHigh: event.detail.dayHigh,
        weekLow: event.detail.weekLow,
        weekHigh: event.detail.weekHigh,
        change: event.detail.change,
        changePercent: event.detail.changePercent,
        recommendation: event.detail.recommendation
      };
      
      setMarketData(newMarketData);
      console.log('useCurrentPrice: Updated market data', newMarketData);

      // تحديث عنصر عرض السعر مباشرة إن وجد
      const priceDisplayElement = document.getElementById('tradingview-price-display');
      if (priceDisplayElement) {
        priceDisplayElement.textContent = `السعر الحالي: ${event.detail.price.toFixed(2)}`;
      }
      
      // تحديث عنصر السعر في الإحصائيات إن وجد
      const statsDisplayElement = document.getElementById('stats-price-display');
      if (statsDisplayElement) {
        statsDisplayElement.textContent = event.detail.price.toFixed(2);
      }
    }
  }, []);

  const requestCurrentPrice = useCallback(() => {
    console.log('Requesting current price...');
    
    // طلب السعر من جميع المصادر المحتملة
    window.dispatchEvent(new Event('request-current-price'));
    window.dispatchEvent(new Event('request-extracted-price'));
    window.dispatchEvent(new Event('request-ui-price-update'));
    
    // أيضًا التحقق من السعر المخزن في الذاكرة المؤقتة
    const cachedPrice = priceUpdater.getLastGoldPrice();
    if (cachedPrice !== null && (currentPrice === null || cachedPrice !== currentPrice)) {
      console.log('useCurrentPrice: تحديث السعر من الذاكرة المؤقتة:', cachedPrice);
      setCurrentPrice(cachedPrice);
      setPriceUpdateCount(prev => prev + 1);
    }
  }, [currentPrice]);

  return {
    currentPrice,
    priceUpdateCount,
    marketData,
    handlePriceUpdate,
    handleCurrentPriceResponse,
    requestCurrentPrice
  };
};
