
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { ReactNode, useEffect, useState } from "react";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const { currentPrice } = useCurrentPrice();
  const [verifiedPrice, setVerifiedPrice] = useState<number | null>(currentPrice);
  
  // التحقق من السعر وضمان تحديثه
  useEffect(() => {
    if (currentPrice !== null) {
      console.log(`CurrentPriceListener: تم تحديث السعر إلى ${currentPrice}`);
      setVerifiedPrice(currentPrice);
    } else {
      // طلب تحديث إضافي للسعر إذا لم يكن متوفراً
      window.dispatchEvent(new CustomEvent('request-current-price'));
      
      // محاولة العثور على السعر مباشرة من العناصر المرئية
      const priceSelectors = [
        '.tv-symbol-price-quote__value',
        '.tv-symbol-header__first-line',
        '.js-symbol-last'
      ];
      
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (text && /\d+,\d+\.\d+|\d+\.\d+/.test(text)) {
            const matches = text.match(/\b\d+,\d+\.\d+\b|\b\d+\.\d+\b/);
            if (matches && matches[0]) {
              const price = parseFloat(matches[0].replace(/,/g, ''));
              if (!isNaN(price) && price > 0) {
                console.log(`CurrentPriceListener: العثور على سعر مباشرة = ${price}`);
                setVerifiedPrice(price);
                
                // بث السعر المكتشف لباقي التطبيق
                window.dispatchEvent(new CustomEvent('tradingview-price-update', {
                  detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
                }));
                
                // أيضًا إرسال حدث إضافي لضمان الوصول لجميع المكونات
                window.dispatchEvent(new CustomEvent('price-updated', {
                  detail: { price, source: 'price-listener' }
                }));
              }
            }
          }
        }
      }
    }
  }, [currentPrice]);
  
  // استمع إلى تحديثات السعر المباشرة
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail?.price) {
        const updatedPrice = event.detail.price;
        console.log(`CurrentPriceListener: تلقي تحديث السعر = ${updatedPrice}`);
        setVerifiedPrice(updatedPrice);
      }
    };
    
    // الاستماع لحدث السعر الجديد للتوافق مع المكونات الأخرى
    window.addEventListener('price-updated', handlePriceUpdate as EventListener);
    
    // الاستماع للأحداث الأخرى أيضًا
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('current-price-response', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('price-updated', handlePriceUpdate as EventListener);
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handlePriceUpdate as EventListener);
    };
  }, []);
  
  // البحث عن السعر دورياً إذا لم يتم العثور عليه
  useEffect(() => {
    const directPriceUpdateInterval = setInterval(() => {
      if (verifiedPrice === null) {
        const priceSelectors = [
          '.tv-symbol-price-quote__value',
          '.tv-symbol-header__first-line',
          '.js-symbol-last'
        ];
        
        for (const selector of priceSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const text = element.textContent?.trim();
            if (text && /\d+,\d+\.\d+|\d+\.\d+/.test(text)) {
              const matches = text.match(/\b\d+,\d+\.\d+\b|\b\d+\.\d+\b/);
              if (matches && matches[0]) {
                const price = parseFloat(matches[0].replace(/,/g, ''));
                if (!isNaN(price) && price > 0) {
                  console.log(`CurrentPriceListener: تحديث من الفاصل الزمني = ${price}`);
                  setVerifiedPrice(price);
                  
                  // بث السعر المكتشف لباقي التطبيق
                  window.dispatchEvent(new CustomEvent('tradingview-price-update', {
                    detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
                  }));
                  
                  // أيضًا إرسال حدث إضافي
                  window.dispatchEvent(new CustomEvent('price-updated', {
                    detail: { price, source: 'interval-listener' }
                  }));
                }
              }
            }
          }
        }
      }
    }, 1000);
    
    return () => {
      clearInterval(directPriceUpdateInterval);
    };
  }, [verifiedPrice]);
  
  return <>{children(verifiedPrice)}</>;
};
