
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
      // تحديث السعر فقط إذا كان في النطاق المتوقع للذهب (1000-5000)
      if (price > 1000 && price < 5000) {
        console.log(`useCurrentPrice: تحديث السعر إلى ${price}`);
        
        // تحديث السعر فقط إذا تغير، أو لم يكن هناك سعر سابق
        if (currentPrice === null || Math.abs(currentPrice - price) > 0.5) {
          setCurrentPrice(price);
          setPriceUpdateCount((prev) => prev + 1);
          
          // تخزين السعر في localStorage لحالات تحديث الصفحة
          localStorage.setItem('lastExtractedPrice', price.toString());
          localStorage.setItem('lastPriceUpdateTime', new Date().toISOString());
          
          // إطلاق حدث تحديث واجهة المستخدم (مهم لتحديث باقي التطبيق)
          window.dispatchEvent(
            new CustomEvent('ui-price-update', {
              detail: { price }
            })
          );
          
          // إضافة حدث جديد لتحديث كافة العناصر التي تستخدم السعر
          window.dispatchEvent(
            new CustomEvent('global-price-update', {
              detail: { price, source: 'useCurrentPrice' }
            })
          );
          
          return true;
        } else {
          console.log(`useCurrentPrice: السعر لم يتغير بشكل كافٍ (${currentPrice} -> ${price})`);
        }
      } else {
        console.warn(`useCurrentPrice: السعر خارج النطاق المتوقع: ${price}`);
      }
    } else {
      console.warn(`useCurrentPrice: تم تجاهل السعر غير الصالح: ${price}`);
    }
    return false;
  }, [currentPrice]);

  useEffect(() => {
    // محاولة استرداد السعر المحفوظ عند بدء التشغيل
    const savedPrice = localStorage.getItem('lastExtractedPrice');
    if (savedPrice) {
      const price = parseFloat(savedPrice);
      if (!isNaN(price)) {
        setCurrentPrice(price);
        // نضيف فقط للعداد إذا كان السعر محدثًا في آخر 30 دقيقة
        const lastUpdateTime = localStorage.getItem('lastPriceUpdateTime');
        if (lastUpdateTime) {
          const lastUpdate = new Date(lastUpdateTime);
          const now = new Date();
          const timeDiff = now.getTime() - lastUpdate.getTime();
          if (timeDiff < 30 * 60 * 1000) { // 30 دقيقة
            setPriceUpdateCount(1);
          }
        }
      }
    }
    
    // محاولة استخراج السعر من HTML مباشرة (كآلية إضافية)
    try {
      const extractPriceFromHtml = () => {
        // البحث عن أنماط سعر الذهب في كل النص
        const bodyText = document.body.innerText || '';
        const priceMatch = bodyText.match(/\b([123][,\d]{0,3}\.\d{1,2})\b/);
        if (priceMatch && priceMatch[1]) {
          const price = parseFloat(priceMatch[1].replace(/,/g, ''));
          if (!isNaN(price) && price > 1000 && price < 5000) {
            console.log(`استخراج السعر مباشرة من HTML: ${price}`);
            updatePrice(price);
          }
        }
      };
      
      // استخراج السعر بعد تحميل الصفحة وبعد فترات منتظمة
      setTimeout(extractPriceFromHtml, 3000);
      setTimeout(extractPriceFromHtml, 6000);
      setTimeout(extractPriceFromHtml, 10000);
    } catch (error) {
      console.error('خطأ في استخراج السعر من HTML:', error);
    }
    
    // مستمع لسعر TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number, source?: string }>) => {
      if (event.detail && event.detail.price) {
        console.log(`استلام تحديث السعر من ${event.detail.source || 'غير معروف'}: ${event.detail.price}`);
        updatePrice(event.detail.price);
      }
    };

    // مستمع لطلب تحديث السعر
    const handleRequestPrice = () => {
      if (currentPrice !== null) {
        console.log("useCurrentPrice: تم استلام طلب تحديث السعر، إرسال:", currentPrice);
        window.dispatchEvent(
          new CustomEvent('current-price-response', {
            detail: { price: currentPrice }
          })
        );
      } else {
        // إذا لم يكن هناك سعر حالي، نطلب تحديث السعر
        window.dispatchEvent(new Event('request-capture-widget'));
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
      if (event.detail && event.detail.price) {
        console.log("useCurrentPrice: تم استلام طلب تحديث واجهة المستخدم:", event.detail.price);
      }
    };

    // مستمع عام لتحديث السعر من أي مصدر
    const handleGlobalPriceUpdate = (event: CustomEvent<{ price: number, source: string }>) => {
      if (event.detail && event.detail.price && event.detail.source !== 'useCurrentPrice') {
        console.log(`useCurrentPrice: تم استلام تحديث سعر عام من ${event.detail.source}:`, event.detail.price);
        updatePrice(event.detail.price);
      }
    };

    // إضافة المستمعين
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-current-price', handleRequestPrice);
    window.addEventListener('image-price-update', handleImagePriceUpdate as EventListener);
    window.addEventListener('ui-price-update', handleUiPriceUpdate as EventListener);
    window.addEventListener('global-price-update', handleGlobalPriceUpdate as EventListener);
    
    // عند التركيب، نطلب السعر المستخرج من الرسم البياني
    window.dispatchEvent(new Event('request-extracted-price'));
    window.dispatchEvent(new Event('request-capture-widget'));
    
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
      window.removeEventListener('global-price-update', handleGlobalPriceUpdate as EventListener);
      clearInterval(intervalId);
    };
  }, [updatePrice, currentPrice]);

  return { currentPrice, priceUpdateCount, updatePrice };
};
