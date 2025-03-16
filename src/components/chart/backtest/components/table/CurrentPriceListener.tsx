
import { useState, useEffect } from "react";
import { priceUpdater } from "@/utils/price/priceUpdater";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => React.ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // الاستماع لتحديثات السعر من جميع المصادر مع تحسينات
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log("CurrentPriceListener: تم استلام تحديث للسعر:", event.detail.price, "من المصدر:", event.detail.source);
        setCurrentPrice(event.detail.price);
      }
    };
    
    // الاستماع لجميع مصادر الأسعار - مع إعطاء الأولوية للسعر المستخرج من الصورة
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('chart-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handlePriceUpdate as EventListener);
    window.addEventListener('extracted-price-update', handlePriceUpdate as EventListener);
    
    // استخدام آخر سعر تم حفظه في محدث السعر
    const lastCachedPrice = priceUpdater.getLastGoldPrice();
    if (lastCachedPrice !== null) {
      console.log("CurrentPriceListener: استخدام آخر سعر محفوظ:", lastCachedPrice);
      setCurrentPrice(lastCachedPrice);
    }
    
    // طلب السعر الحالي عند تحميل المكون - إرسال طلب لجميع المصادر المحتملة
    window.dispatchEvent(new Event('request-current-price'));
    window.dispatchEvent(new Event('request-extracted-price'));
    
    // تحديث متكرر للسعر للتأكد من حصولنا على آخر القيم
    const updateInterval = setInterval(() => {
      // طلب تحديث متكرر للسعر
      window.dispatchEvent(new Event('request-current-price'));
      window.dispatchEvent(new Event('request-extracted-price'));
      
      // أيضًا التحقق من آخر سعر في الذاكرة المؤقتة
      const cachedPrice = priceUpdater.getLastGoldPrice();
      if (cachedPrice !== null && (currentPrice === null || cachedPrice !== currentPrice)) {
        console.log("CurrentPriceListener: تحديث السعر من الذاكرة المؤقتة:", cachedPrice);
        setCurrentPrice(cachedPrice);
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('chart-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handlePriceUpdate as EventListener);
      window.removeEventListener('extracted-price-update', handlePriceUpdate as EventListener);
      clearInterval(updateInterval);
    };
  }, [currentPrice]);

  // إضافة تشخيص للتأكد من توفر السعر
  useEffect(() => {
    console.log("CurrentPriceListener: السعر الحالي =", currentPrice);
  }, [currentPrice]);

  return <>{children(currentPrice)}</>;
};
