
import { useState, useEffect } from 'react';
import { getLastExtractedPrice } from '@/utils/price/screenshotPriceExtractor';

interface UseExtractedPriceOptions {
  onPriceChange?: (price: number) => void;
  defaultPrice?: number | null;
}

export const useExtractedPrice = (options: UseExtractedPriceOptions = {}) => {
  const { onPriceChange, defaultPrice } = options;
  
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  const [priceSource, setPriceSource] = useState<'extracted' | 'tradingview' | 'default' | 'none'>('none');
  
  // استخراج آخر سعر عند التحميل
  useEffect(() => {
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
        setPriceSource('extracted');
        onPriceChange?.(event.detail.price);
      }
    };
    
    // الاستماع لتحديثات السعر من TradingView
    const handleTradingViewPrice = (event: CustomEvent) => {
      // نستخدم السعر من TradingView فقط إذا لم يكن لدينا سعر مستخرج
      if (priceSource !== 'extracted' && event.detail && event.detail.price) {
        console.log('useExtractedPrice: تم استلام سعر من TradingView:', event.detail.price);
        setExtractedPrice(event.detail.price);
        setPriceSource('tradingview');
        onPriceChange?.(event.detail.price);
      }
    };

    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleTradingViewPrice as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleTradingViewPrice as EventListener);
    };
  }, [onPriceChange, priceSource]);

  return {
    price: extractedPrice,
    priceSource,
    hasPrice: extractedPrice !== null,
    isExtractedPrice: priceSource === 'extracted'
  };
};
