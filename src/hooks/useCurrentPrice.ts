
import { useState, useEffect } from 'react';

interface UseCurrentPriceResult {
  currentPrice: number | null;
  priceUpdateCount: number;
  updatePrice: (price: number) => void;
}

export const useCurrentPrice = (): UseCurrentPriceResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

  const updatePrice = (price: number) => {
    if (price !== currentPrice && !isNaN(price)) {
      console.log(`useCurrentPrice: تحديث السعر إلى ${price}`);
      setCurrentPrice(price);
      setPriceUpdateCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    // مستمع لسعر TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        updatePrice(event.detail.price);
      }
    };

    // مستمع لطلب تحديث السعر
    const handleRequestPrice = () => {
      console.log("useCurrentPrice: تم استلام طلب تحديث السعر");
      // إذا كان لدينا سعر حالي، نستجيب للطلب
      if (currentPrice !== null) {
        window.dispatchEvent(
          new CustomEvent('current-price-response', {
            detail: { price: currentPrice }
          })
        );
      }
    };

    // إضافة المستمعين
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-current-price', handleRequestPrice);
    
    // عند التركيب، نطلب السعر المستخرج من الرسم البياني
    window.dispatchEvent(new Event('request-extracted-price'));

    // تنظيف المستمعين
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handleRequestPrice);
    };
  }, [currentPrice]);

  return { currentPrice, priceUpdateCount, updatePrice };
};
