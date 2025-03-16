
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
    // التحقق من وجود سعر مستخرج سابقًا أولاً (أصبح هذا هو الأولوية الأولى)
    const lastPrice = getLastExtractedPrice();
    if (lastPrice !== null) {
      setExtractedPrice(lastPrice);
      setPriceSource('extracted');
      onPriceChange?.(lastPrice);
    } 
    // التحقق من وجود سعر من Alpha Vantage كخيار ثانٍ
    else {
      const alphaVantagePrice = priceUpdater.getLastGoldPrice();
      if (alphaVantagePrice !== null) {
        setExtractedPrice(alphaVantagePrice);
        setPriceSource('alphavantage');
        onPriceChange?.(alphaVantagePrice);
      }
      // استخدام السعر الافتراضي كخيار أخير
      else if (defaultPrice !== null && defaultPrice !== undefined) {
        setExtractedPrice(defaultPrice);
        setPriceSource('default');
      }
    }
  }, [defaultPrice, onPriceChange]);
  
  // الاستماع لتحديثات السعر المستخرج من الصورة
  useEffect(() => {
    const handleExtractedPriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('useExtractedPrice: تم استلام تحديث السعر المستخرج:', event.detail.price);
        setExtractedPrice(event.detail.price);
        setPriceSource(event.detail.source === 'alphavantage' ? 'alphavantage' : 'extracted');
        onPriceChange?.(event.detail.price);
      }
    };
    
    // الاستماع لتحديثات السعر من TradingView (أصبح بأولوية منخفضة)
    const handleTradingViewPrice = (event: CustomEvent) => {
      // نستخدم السعر من TradingView فقط إذا لم يكن لدينا سعر مستخرج
      if (priceSource === 'none' || priceSource === 'default') {
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
        // تعديل: تخزين السعر المباشر من الشارت ولكن لا يتم استخدامه كأولوية أعلى
        setChartPrice(event.detail.price);
      }
    };

    window.addEventListener('tradingview-price-update', handleExtractedPriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleTradingViewPrice as EventListener);
    window.addEventListener('chart-price-update', handleChartPrice as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleExtractedPriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleTradingViewPrice as EventListener);
      window.removeEventListener('chart-price-update', handleChartPrice as EventListener);
    };
  }, [onPriceChange, priceSource]);

  // استخدام السعر المستخرج من الصورة كأولوية عليا (تغيير الأولوية هنا)
  const price = extractedPrice !== null ? extractedPrice : chartPrice;

  return {
    price,
    priceSource: extractedPrice !== null ? priceSource : (chartPrice !== null ? 'chart' : 'none'),
    hasPrice: price !== null,
    isExtractedPrice: priceSource === 'extracted' || priceSource === 'alphavantage',
    isAlphaVantagePrice: priceSource === 'alphavantage'
  };
};
