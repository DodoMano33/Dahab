
import { useState, useEffect } from "react";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => React.ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // الاستماع لتحديثات السعر من جميع المصادر
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
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    // أيضا طلب تحديث صريح من الأنظمة الأخرى
    if (typeof window !== 'undefined') {
      // محاولة إرسال حدث للحصول على سعر من خدمة استخراج السعر
      try {
        window.dispatchEvent(new CustomEvent('request-extracted-price'));
      } catch (e) {
        console.error("خطأ عند طلب السعر المستخرج:", e);
      }
    }
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('chart-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handlePriceUpdate as EventListener);
    };
  }, []);

  return <>{children(currentPrice)}</>;
};
