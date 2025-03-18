
import { useState, useEffect, useCallback } from 'react';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface UseCurrentPriceResult {
  currentPrice: number | null;
  priceUpdateCount: number;
  updatePrice: (price: number) => void;
}

export const useCurrentPrice = (): UseCurrentPriceResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

  // تحديث السعر مع التحقق من صحته
  const updatePrice = useCallback((price: number) => {
    if (price && !isNaN(price) && (price !== currentPrice || currentPrice === null)) {
      console.log(`useCurrentPrice: تحديث السعر إلى ${price}`);
      setCurrentPrice(price);
      setPriceUpdateCount((prev) => prev + 1);
      
      // تخزين السعر في localStorage للرجوع إليه لاحقًا
      localStorage.setItem('lastExtractedPrice', price.toString());
      localStorage.setItem('lastPriceUpdateTime', new Date().toISOString());

      // إطلاق حدث لإعلام المكونات الأخرى بتحديث السعر
      window.dispatchEvent(
        new CustomEvent('tradingview-price-update', {
          detail: { price }
        })
      );
    }
  }, [currentPrice]);

  // محاولة استخراج السعر مباشرة من الويدجت
  const extractPriceDirectly = useCallback(async () => {
    try {
      const price = await extractPriceFromChart();
      if (price !== null && !isNaN(price)) {
        updatePrice(price);
        return true;
      }
    } catch (error) {
      console.error("useCurrentPrice: خطأ في استخراج السعر مباشرة:", error);
    }
    return false;
  }, [updatePrice]);

  // استرداد السعر المحفوظ عند بدء التشغيل
  useEffect(() => {
    const savedPrice = localStorage.getItem('lastExtractedPrice');
    if (savedPrice) {
      const price = parseFloat(savedPrice);
      if (!isNaN(price)) {
        setCurrentPrice(price);
        setPriceUpdateCount(1);
        console.log(`useCurrentPrice: تم استرداد السعر المحفوظ: ${price}`);
      }
    }
    
    // محاولة استخراج السعر الحالي
    extractPriceDirectly();
  }, [extractPriceDirectly]);

  // الاستماع لأحداث تحديث السعر وطلباته
  useEffect(() => {
    // مستمع لتحديثات السعر من TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        updatePrice(event.detail.price);
      }
    };

    // مستمع لطلبات السعر الحالي
    const handleRequestPrice = async () => {
      console.log("useCurrentPrice: تم استلام طلب تحديث السعر");
      
      // محاولة استخراج السعر مباشرة من الويدجت
      const success = await extractPriceDirectly();
      
      // إذا لم نتمكن من استخراج السعر والسعر الحالي متاح
      if (!success && currentPrice !== null) {
        console.log("useCurrentPrice: إرسال السعر الحالي:", currentPrice);
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price: currentPrice }
          })
        );
      } else if (!success) {
        console.log("useCurrentPrice: لا يوجد سعر حالي للإرسال");
      }
    };

    // إضافة المستمعين
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-current-price', handleRequestPrice);
    
    console.log("useCurrentPrice: تم إضافة المستمعين");
    
    // محاولة استخراج السعر كل 5 ثوانٍ
    const intervalId = setInterval(async () => {
      await extractPriceDirectly();
    }, 5000);
    
    // التنظيف عند إزالة المكون
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-current-price', handleRequestPrice);
      console.log("useCurrentPrice: تم إزالة المستمعين");
    };
  }, [currentPrice, extractPriceDirectly, updatePrice]);

  return { currentPrice, priceUpdateCount, updatePrice };
};
