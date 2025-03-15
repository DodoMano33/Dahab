
import { useState, useEffect } from 'react';
import { getLastExtractedPrice } from '@/utils/price/screenshotPriceExtractor';
import { priceUpdater } from '@/utils/price/priceUpdater';

interface UseExtractedPriceOptions {
  onPriceChange?: (price: number) => void;
  defaultPrice?: number | null;
}

export const useExtractedPrice = (options: UseExtractedPriceOptions = {}) => {
  const { onPriceChange, defaultPrice } = options;
  
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  const [chartPrice, setChartPrice] = useState<number | null>(null);
  const [priceSource, setPriceSource] = useState<'extracted' | 'tradingview' | 'default' | 'alphavantage' | 'chart' | 'none'>('none');
  
  // استخراج آخر سعر عند التحميل
  useEffect(() => {
    // التحقق من وجود سعر من Alpha Vantage أولاً
    const alphaVantagePrice = priceUpdater.getLastGoldPrice();
    if (alphaVantagePrice !== null) {
      setExtractedPrice(alphaVantagePrice);
      setPriceSource('alphavantage');
      onPriceChange?.(alphaVantagePrice);
      return;
    }
    
    // التحقق من وجود سعر مستخرج سابقاً
    const lastPrice = getLastExtractedPrice();
    if (lastPrice !== null) {
      setExtractedPrice(lastPrice);
      setPriceSource('extracted');
      onPriceChange?.(lastPrice);
    } else if (defaultPrice !== null && defaultPrice !== undefined) {
      setExtractedPrice(defaultPrice);
      setPriceSource('default');
    }
  }, [defaultPrice, onPriceChange]);
  
  // الاستماع لتحديثات السعر المستخرج من الصورة
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('useExtractedPrice: تم استلام تحديث السعر:', event.detail.price);
        setExtractedPrice(event.detail.price);
        setPriceSource(event.detail.source === 'alphavantage' ? 'alphavantage' : 'extracted');
        onPriceChange?.(event.detail.price);
      }
    };
    
    // الاستماع لتحديثات السعر من TradingView
    const handleTradingViewPrice = (event: CustomEvent) => {
      // نستخدم السعر من TradingView فقط إذا لم يكن لدينا سعر مستخرج أو من Alpha Vantage
      if (priceSource !== 'extracted' && priceSource !== 'alphavantage' && event.detail && event.detail.price) {
        console.log('useExtractedPrice: تم استلام سعر من TradingView:', event.detail.price);
        setExtractedPrice(event.detail.price);
        setPriceSource('tradingview');
        onPriceChange?.(event.detail.price);
      }
    };
    
    // الاستماع للسعر مباشرة من الشارت
    const handleChartPrice = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('useExtractedPrice: تم استلام سعر مباشر من الشارت:', event.detail.price);
        setChartPrice(event.detail.price);
        // لا نغير مصدر السعر هنا لاستخدام chart-price كأولوية أعلى دائمًا
        onPriceChange?.(event.detail.price);
      }
    };

    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleTradingViewPrice as EventListener);
    window.addEventListener('chart-price-update', handleChartPrice as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleTradingViewPrice as EventListener);
      window.removeEventListener('chart-price-update', handleChartPrice as EventListener);
    };
  }, [onPriceChange, priceSource]);

  // استخدام السعر من الشارت كأولوية عليا
  const price = chartPrice !== null ? chartPrice : extractedPrice;

  return {
    price,
    priceSource: chartPrice !== null ? 'chart' : priceSource,
    hasPrice: price !== null,
    isExtractedPrice: priceSource === 'extracted' || priceSource === 'alphavantage',
    isAlphaVantagePrice: priceSource === 'alphavantage'
  };
};
