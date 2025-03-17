
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
    if ((price !== currentPrice && !isNaN(price)) || currentPrice === null) {
      console.log(`useCurrentPrice: تحديث السعر إلى ${price}`);
      setCurrentPrice(price);
      setPriceUpdateCount((prev) => prev + 1);
      
      // تخزين السعر في localStorage لحالات تحديث الصفحة
      localStorage.setItem('lastExtractedPrice', price.toString());
      localStorage.setItem('lastPriceUpdateTime', new Date().toISOString());
    }
  };

  useEffect(() => {
    // محاولة استرداد السعر المحفوظ عند بدء التشغيل
    const savedPrice = localStorage.getItem('lastExtractedPrice');
    if (savedPrice) {
      const price = parseFloat(savedPrice);
      if (!isNaN(price)) {
        setCurrentPrice(price);
        setPriceUpdateCount(1);
        console.log(`useCurrentPrice: تم استرداد السعر المحفوظ: ${price}`);
      }
    }
    
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
        console.log("useCurrentPrice: إرسال السعر الحالي:", currentPrice);
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price: currentPrice }
          })
        );
      } else {
        console.log("useCurrentPrice: لا يوجد سعر حالي للإرسال");
      }
    };

    // إضافة المستمعين
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-current-price', handleRequestPrice);
    
    console.log("useCurrentPrice: تم إضافة المستمعين");
    
    // التنظيف عند إزالة المكون
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handleRequestPrice);
      console.log("useCurrentPrice: تم إزالة المستمعين");
    };
  }, [currentPrice]);

  return { currentPrice, priceUpdateCount, updatePrice };
};
