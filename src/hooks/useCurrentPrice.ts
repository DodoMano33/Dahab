
import { useState, useEffect, useCallback } from 'react';

interface UseCurrentPriceResult {
  currentPrice: number | null;
  priceUpdateCount: number;
  updatePrice: (price: number) => void;
}

export const useCurrentPrice = (): UseCurrentPriceResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

  const updatePrice = useCallback((price: number) => {
    if (!isNaN(price) && price > 0) {
      console.log(`useCurrentPrice: تحديث السعر إلى ${price}`);
      setCurrentPrice(price);
      setPriceUpdateCount((prev) => prev + 1);
      
      // تخزين السعر في localStorage لحالات تحديث الصفحة
      localStorage.setItem('lastExtractedPrice', price.toString());
      localStorage.setItem('lastPriceUpdateTime', new Date().toISOString());
      
      // إطلاق حدث تحديث واجهة المستخدم
      window.dispatchEvent(
        new CustomEvent('ui-price-update', {
          detail: { price }
        })
      );
    } else {
      console.warn(`useCurrentPrice: تم تجاهل السعر غير الصالح: ${price}`);
    }
  }, []);

  useEffect(() => {
    // محاولة استرداد السعر المحفوظ عند بدء التشغيل
    const savedPrice = localStorage.getItem('lastExtractedPrice');
    if (savedPrice) {
      const price = parseFloat(savedPrice);
      if (!isNaN(price)) {
        setCurrentPrice(price);
        // نضيف فقط للعداد إذا كان السعر محدثًا في آخر 5 دقائق
        const lastUpdateTime = localStorage.getItem('lastPriceUpdateTime');
        if (lastUpdateTime) {
          const lastUpdate = new Date(lastUpdateTime);
          const now = new Date();
          const timeDiff = now.getTime() - lastUpdate.getTime();
          if (timeDiff < 5 * 60 * 1000) { // 5 دقائق
            setPriceUpdateCount(1);
          }
        }
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
        window.dispatchEvent(
          new CustomEvent('current-price-response', {
            detail: { price: currentPrice }
          })
        );
      }
    };

    // مستمع لحدث محدد لتحديث السعر من الصورة
    const handleImagePriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        console.log("useCurrentPrice: تحديث السعر من الصورة:", event.detail.price);
        updatePrice(event.detail.price);
      }
    };

    // مستمع لتحديث واجهة المستخدم
    const handleUiPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      console.log("useCurrentPrice: تم استلام طلب تحديث واجهة المستخدم:", event.detail?.price);
    };

    // إضافة المستمعين
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-current-price', handleRequestPrice);
    window.addEventListener('image-price-update', handleImagePriceUpdate as EventListener);
    window.addEventListener('ui-price-update', handleUiPriceUpdate as EventListener);
    
    // عند التركيب، نطلب السعر المستخرج من الرسم البياني
    window.dispatchEvent(new Event('request-extracted-price'));
    
    // طلب السعر الحالي كل ثانية
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 1000);

    // تنظيف المستمعين
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handleRequestPrice);
      window.removeEventListener('image-price-update', handleImagePriceUpdate as EventListener);
      window.removeEventListener('ui-price-update', handleUiPriceUpdate as EventListener);
      clearInterval(intervalId);
    };
  }, [updatePrice, currentPrice]);

  return { currentPrice, priceUpdateCount, updatePrice };
};
