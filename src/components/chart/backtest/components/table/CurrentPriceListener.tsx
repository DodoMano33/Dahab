
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
      const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
      for (const element of priceElements) {
        const text = element.textContent?.trim();
        if (text) {
          const price = parseFloat(text.replace(/,/g, ''));
          if (!isNaN(price) && price >= 1800 && price <= 3500) {
            console.log(`CurrentPriceListener: العثور على سعر مباشرة = ${price}`);
            setVerifiedPrice(price);
            
            // بث السعر المكتشف لباقي التطبيق
            window.dispatchEvent(new CustomEvent('tradingview-price-update', {
              detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
            }));
          }
        }
      }
    }
  }, [currentPrice]);
  
  // استمع إلى تحديثات السعر المباشرة من الشارت
  useEffect(() => {
    const directPriceUpdateInterval = setInterval(() => {
      if (verifiedPrice === null) {
        const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
        for (const element of priceElements) {
          const text = element.textContent?.trim();
          if (text) {
            const price = parseFloat(text.replace(/,/g, ''));
            if (!isNaN(price) && price >= 1800 && price <= 3500) {
              console.log(`CurrentPriceListener: تحديث من الفاصل الزمني = ${price}`);
              setVerifiedPrice(price);
              
              // بث السعر المكتشف لباقي التطبيق
              window.dispatchEvent(new CustomEvent('tradingview-price-update', {
                detail: { price, symbol: 'CFI:XAUUSD', timestamp: Date.now() }
              }));
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
